import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from './AuthContext';
import {TMDB_API_KEY_SAFE} from '../config/tmdb';

export type MovieSearchItem = {
	id: number;
	title: string;
	poster_path?: string | null;
	overview?: string;
	release_date?: string;
};

export type WatchedMovie = {
	id: number;
	title: string;
	poster_path?: string | null;
	overview?: string;
	rating: number; // 0-10
	addedAt: number;
};

type MoviesContextValue = {
	searchResults: MovieSearchItem[];
	isSearching: boolean;
	searchMovies: (query: string) => Promise<void>;
	watched: WatchedMovie[];
	addOrUpdateWatched: (movie: Omit<WatchedMovie, 'addedAt'>) => Promise<void>;
	removeWatched: (movieId: number) => Promise<void>;
	getWatchedById: (movieId: number) => WatchedMovie | undefined;
};

const MoviesContext = createContext<MoviesContextValue | undefined>(undefined);

function userWatchedKey(userId: string): string {
	return `pipoca_nota_watched_${userId}_v1`;
}

export const MoviesProvider: React.FC<React.PropsWithChildren> = ({children}) => {
	const {currentUser} = useAuth();
	const [searchResults, setSearchResults] = useState<MovieSearchItem[]>([]);
	const [isSearching, setIsSearching] = useState<boolean>(false);
	const [watched, setWatched] = useState<WatchedMovie[]>([]);

	useEffect(() => {
		(async () => {
			if (!currentUser) {
				setWatched([]);
				return;
			}
			const raw = await AsyncStorage.getItem(userWatchedKey(currentUser.id));
			setWatched(raw ? JSON.parse(raw) : []);
		})();
	}, [currentUser]);

	const persistWatched = useCallback(async (list: WatchedMovie[]) => {
		if (!currentUser) return;
		await AsyncStorage.setItem(userWatchedKey(currentUser.id), JSON.stringify(list));
	}, [currentUser]);

	const addOrUpdateWatched = useCallback(async (movie: Omit<WatchedMovie, 'addedAt'>) => {
		setWatched(prev => {
			const idx = prev.findIndex(m => m.id === movie.id);
			let next: WatchedMovie[];
			if (idx >= 0) {
				next = [...prev];
				next[idx] = {...next[idx], ...movie};
			} else {
				next = [{...movie, addedAt: Date.now()}, ...prev];
			}
			void persistWatched(next);
			return next;
		});
	}, [persistWatched]);

	const removeWatched = useCallback(async (movieId: number) => {
		setWatched(prev => {
			const next = prev.filter(m => m.id !== movieId);
			void persistWatched(next);
			return next;
		});
	}, [persistWatched]);

	const searchMovies = useCallback(async (query: string) => {
		const q = query.trim();
		if (!q) {
			setSearchResults([]);
			return;
		}
		setIsSearching(true);
		try {
			const apiKey = TMDB_API_KEY_SAFE();
			if (!apiKey) {
				throw new Error('TMDb API key ausente. Configure em src/config/tmdb.local.ts');
			}
			const url = `https://api.themoviedb.org/3/search/movie?api_key=${encodeURIComponent(apiKey)}&language=pt-BR&query=${encodeURIComponent(q)}&page=1&include_adult=false`;
			const res = await fetch(url);
			const json = await res.json();
			setSearchResults((json?.results ?? []).map((r: any) => ({
				id: r.id,
				title: r.title,
				poster_path: r.poster_path,
				overview: r.overview,
				release_date: r.release_date,
			})));
		} catch (e) {
			setSearchResults([]);
		} finally {
			setIsSearching(false);
		}
	}, []);

	const getWatchedById = useCallback((movieId: number) => {
		return watched.find(w => w.id === movieId);
	}, [watched]);

	const value = useMemo<MoviesContextValue>(() => ({
		searchResults,
		isSearching,
		searchMovies,
		watched,
		addOrUpdateWatched,
		removeWatched,
		getWatchedById,
	}), [addOrUpdateWatched, getWatchedById, isSearching, removeWatched, searchMovies, searchResults, watched]);

	return <MoviesContext.Provider value={value}>{children}</MoviesContext.Provider>;
};

export function useMovies(): MoviesContextValue {
	const ctx = useContext(MoviesContext);
	if (!ctx) throw new Error('useMovies must be used within MoviesProvider');
	return ctx;
}


