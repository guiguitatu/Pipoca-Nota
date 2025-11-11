const API_BASE = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

import { TMDB_API_KEY_SAFE } from '../config/tmdb';

export async function searchMovies(query: string) {
	const key = TMDB_API_KEY_SAFE();
	if (!key) return [];
	const url = `${API_BASE}/search/movie?query=${encodeURIComponent(query)}&language=pt-BR&include_adult=false&api_key=${encodeURIComponent(key)}`;
	const res = await fetch(url);
	if (!res.ok) return [];
	const json = await res.json();
	return json.results ?? [];
}

export async function getMovieDetails(id: number) {
	const key = TMDB_API_KEY_SAFE();
	if (!key) return null;
	const url = `${API_BASE}/movie/${id}?language=pt-BR&api_key=${encodeURIComponent(key)}`;
	const res = await fetch(url);
	if (!res.ok) return null;
	return await res.json();
}


