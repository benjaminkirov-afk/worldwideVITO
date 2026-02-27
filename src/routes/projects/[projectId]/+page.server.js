import { error } from '@sveltejs/kit';

const WP_BASE_URL = 'https://admin.vitopro.ru';
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

export async function load({ params, fetch }) {
	const slug = decodeURIComponent(params.projectId);

	// Проверка кеша
	const cached = cache.get(slug);
	if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
		return { project: cached.data };
	}

	// Получаем проект по slug
	const res = await fetch(`${WP_BASE_URL}/wp-json/wp/v2/project?slug=${slug}`);
	if (!res.ok) error(res.status, 'Ошибка при загрузке данных WordPress');

	const data = await res.json();
	if (!data.length) error(404, 'Проект не найден');

	const projectData = data[0];

	// Обложка
	let cover = null;
	const coverId = projectData.acf?.cover_image || projectData.featured_media || 0;
	if (coverId) {
		const coverRes = await fetch(`${WP_BASE_URL}/wp-json/wp/v2/media/${coverId}`);
		if (coverRes.ok) cover = await coverRes.json();
	}

	// Галерея
	const galleryIds = [
		projectData.acf?.image_1,
		projectData.acf?.image_2,
		projectData.acf?.image_3,
		projectData.acf?.image_4,
		projectData.acf?.image_5,
		projectData.acf?.image_6
	].filter(Boolean);

	const gallery = await Promise.all(
		galleryIds.map(async (id) => {
			const imgRes = await fetch(`${WP_BASE_URL}/wp-json/wp/v2/media/${id}`);
			return imgRes.ok ? await imgRes.json() : null;
		})
	);

	const formattedGallery = gallery.filter(Boolean).map((img) => ({
		src: img.source_url || '/placeholder.png',
		alt: img.alt_text || ''
	}));

	// Форматируем данные проекта
	const project = {
		title: projectData.title.rendered,
		type: projectData.acf?.type || '',
		customer: projectData.acf?.customer || '',
		location: projectData.acf?.location || '',
		clients: projectData.acf?.clients || 0,
		src: cover?.source_url || '/placeholder.png',
		alt: cover?.alt_text || projectData.title.rendered,
		gallery: formattedGallery
	};

	// Сохраняем в кеш
	cache.set(slug, { data: project, timestamp: Date.now() });

	return { project };
}
