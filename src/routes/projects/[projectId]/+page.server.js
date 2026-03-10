import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function load({ params }) {
	const { data: project, error: err } = await supabase
		.from('projects')
		.select('*')
		.eq('id', params.projectId)
		.single();

	if (err || !project) error(404, 'Проект не найден');

	const gallery = (project.gallery || []).map((src) => ({
		src,
		alt: project.title
	}));

	return {
		project: {
			title: project.title,
			type: project.type,
			customer: project.client,
			location: project.location,
			clients: project.participants,
			src: project.cover_url || '/placeholder.png',
			alt: project.title,
			gallery
		}
	};
}