import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

export type WatchedMovie = {
	id: number;
	title: string;
	posterPath?: string;
	rating: number; // 0-10
	ratedAt: string;
};

type MoviesContextType = {
	watched: WatchedMovie[];
	saveRating: (movie: Omit<WatchedMovie, 'ratedAt'>) => Promise<void>;
	removeWatched: (movieId: number) => Promise<void>;
};

const MoviesContext = createContext<MoviesContextType | undefined>(undefined);

const watchedKeyForUser = (userId: string) => `pipoca_nota_watched_${userId}`;

export const MoviesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const { currentUser } = useAuth();
	const [watched, setWatched] = useState<WatchedMovie[]>([]);

	const load = useCallback(async () => {
		if (!currentUser) {
			setWatched([]);
			return;
		}
		const json = await AsyncStorage.getItem(watchedKeyForUser(currentUser.id));
		setWatched(json ? (JSON.parse(json) as WatchedMovie[]) : []);
	}, [currentUser]);

	useEffect(() => {
		load().catch(() => {});
	}, [load]);

	const persist = useCallback(
		async (data: WatchedMovie[]) => {
			if (!currentUser) return;
			await AsyncStorage.setItem(watchedKeyForUser(currentUser.id), JSON.stringify(data));
		},
		[currentUser]
	);

	const saveRating = useCallback(
		async (movie: Omit<WatchedMovie, 'ratedAt'>) => {
			const existingIdx = watched.findIndex(m => m.id === movie.id);
			let updated: WatchedMovie[];
			if (existingIdx >= 0) {
				updated = [...watched];
				updated[existingIdx] = { ...updated[existingIdx], rating: movie.rating, ratedAt: new Date().toISOString() };
			} else {
				updated = [...watched, { ...movie, ratedAt: new Date().toISOString() }];
			}
			setWatched(updated);
			await persist(updated);
		},
		[watched, persist]
	);

	const removeWatched = useCallback(
		async (movieId: number) => {
			const updated = watched.filter(m => m.id !== movieId);
			setWatched(updated);
			await persist(updated);
		},
		[watched, persist]
	);

	const value = useMemo(() => ({ watched, saveRating, removeWatched }), [watched, saveRating, removeWatched]);

	return <MoviesContext.Provider value={value}>{children}</MoviesContext.Provider>;
};

export const useMovies = (): MoviesContextType => {
	const ctx = useContext(MoviesContext);
	if (!ctx) throw new Error('useMovies must be used within MoviesProvider');
	return ctx;
};


