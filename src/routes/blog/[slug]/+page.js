import { getAllBlogs } from '$lib/blogs.js';
import { error } from '@sveltejs/kit';

export const prerender = true;

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  const blogs = getAllBlogs();
  const post = blogs.find(b => b.slug === params.slug);

  if (!post) {
    throw error(404, `Post "${params.slug}" not found`);
  }

  return { post };
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
  return getAllBlogs().map(b => ({ slug: b.slug }));
}

