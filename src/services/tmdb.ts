const API_BASE = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const apiKey = process.env.EXPO_PUBLIC_TMDB_API_KEY;

if (!apiKey) {
	// Non-fatal. The UI will show empty results unless key is set.
	console.warn('TMDb API key not found. Set EXPO_PUBLIC_TMDB_API_KEY in your environment.');
}

export async function searchMovies(query: string) {
	const url = `${API_BASE}/search/movie?query=${encodeURIComponent(query)}&language=pt-BR&include_adult=false`;
	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json;charset=utf-8' }
	});
	if (!res.ok) return [];
	const json = await res.json();
	return json.results ?? [];
}

export async function getMovieDetails(id: number) {
	const url = `${API_BASE}/movie/${id}?language=pt-BR`;
	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json;charset=utf-8' }
	});
	if (!res.ok) return null;
	return await res.json();
}


