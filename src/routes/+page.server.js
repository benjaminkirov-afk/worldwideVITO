import { supabase } from '$lib/supabase';

export async function load() {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, title, type, cover_url')
    .eq('show_on_home', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return { projects: [] };
  }

  return { projects };
}