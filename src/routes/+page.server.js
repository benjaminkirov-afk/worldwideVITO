// src/routes/+page.server.js
import { error } from '@sveltejs/kit';
import { WP_BASE_URL } from '$env/static/private'; // <-- ВАЖНО

if (!WP_BASE_URL) {
	console.warn('⚠️ WP_BASE_URL не задан! Установите переменную окружения на Amvera.');
}

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

const allowedIds = [32, 187, 26, 113, 130, 138, 163, 238, 105];

async function safeFetch(url, options = {}, timeout = 5000) {
	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), timeout);
	try {
		const res = await fetch(url, { ...options, signal: controller.signal });
		return res;
	} catch (err) {
		console.error('Fetch error:', url, err);
		return null;
	} finally {
		clearTimeout(id);
	}
}

export async function load() {
	console.log('WP_BASE_URL =', WP_BASE_URL);

	if (!WP_BASE_URL) {
		return { projects: [] };
	}

	const cacheKey = 'homeProjects';
	const cached = cache.get(cacheKey);

	if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
		return { projects: cached.data };
	}

	let projects = [];

	try {
		const res = await safeFetch(`${WP_BASE_URL}/wp-json/wp/v2/project?per_page=100`);
		if (!res || !res.ok) {
			console.warn('WP API недоступен или вернул ошибку, возвращаем пустой массив');
			return { projects: [] };
		}

		const data = await res.json();

		const homeProjects = data
			.filter((p) => !!p.acf?.show_on_home && allowedIds.includes(p.id))
			.sort((a, b) => allowedIds.indexOf(a.id) - allowedIds.indexOf(b.id));

		projects = await Promise.all(
			homeProjects.map(async (p) => {
				let src = '/placeholder.png';

				if (p.acf?.cover_image) {
					const imgRes = await safeFetch(`${WP_BASE_URL}/wp-json/wp/v2/media/${p.acf.cover_image}`);
					if (imgRes && imgRes.ok) {
						const imgData = await imgRes.json();
						src = imgData.source_url || src;
					}
				}

				return {
					id: p.id,
					title: p.title.rendered,
					slug: p.slug,
					type: p.acf?.type || '',
					customer: p.acf?.customer || '',
					location: p.acf?.location || '',
					clients: p.acf?.clients || 0,
					src,
					alt: p.title.rendered
				};
			})
		);

		cache.set(cacheKey, { data: projects, timestamp: Date.now() });
		return { projects };
	} catch (err) {
		console.error('Ошибка при загрузке проектов:', err);
		return { projects: [] };
	}
}