import React, {useEffect, useState} from 'react';
import {Alert, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../navigation';
import {useMovies, WatchedMovie} from '../context/MoviesContext';
import {TMDB_API_KEY_SAFE} from '../config/tmdb';

type Props = NativeStackScreenProps<AppStackParamList, 'MovieDetails'>;

type MovieDetails = {
	id: number;
	title: string;
	poster_path?: string | null;
	overview?: string;
	release_date?: string;
	runtime?: number;
};

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w300';

const RatingStar: React.FC<{filled: boolean; onPress: () => void; label: string}> = ({filled, onPress, label}) => {
	return (
		<Pressable
			onPress={onPress}
			style={({pressed}) => [styles.star, pressed && styles.pressed]}
			accessible
			accessibilityRole="button"
			accessibilityLabel={label}
			hitSlop={8}>
			<Text style={[styles.starText, filled && styles.starFilled]}>{filled ? '★' : '☆'}</Text>
		</Pressable>
	);
};

const MovieDetailsScreen: React.FC<Props> = ({route}) => {
	const {movieId} = route.params;
	const {addOrUpdateWatched, getWatchedById, removeWatched} = useMovies();
	const [details, setDetails] = useState<MovieDetails | null>(null);
	const existing = getWatchedById(movieId);
	const [rating, setRating] = useState<number>(existing?.rating ?? 0);

	useEffect(() => {
		async function load() {
			try {
				const apiKey = TMDB_API_KEY_SAFE();
				if (!apiKey) throw new Error('TMDb API key ausente.');
				const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${encodeURIComponent(apiKey)}&language=pt-BR`;
				const res = await fetch(url);
				const json = await res.json();
				setDetails(json);
			} catch {
				Alert.alert('Erro', 'Falha ao carregar detalhes.');
			}
		}
		load();
	}, [movieId]);

	async function onSave() {
		if (!details) return;
		const payload: Omit<WatchedMovie, 'addedAt'> = {
			id: details.id,
			title: details.title,
			poster_path: details.poster_path,
			overview: details.overview,
			rating,
		};
		await addOrUpdateWatched(payload);
		Alert.alert('Salvo', 'Filme salvo em assistidos.');
	}

	async function onRemove() {
		await removeWatched(movieId);
		Alert.alert('Removido', 'Filme removido dos assistidos.');
	}

	return (
		<View style={styles.container}>
			{details?.poster_path ? (
				<Image
					source={{uri: `${IMAGE_BASE}${details.poster_path}`}}
					style={styles.poster}
					accessible
					accessibilityLabel={`Pôster do filme ${details?.title ?? ''}`}
				/>
			) : null}
			<Text style={styles.title}>{details?.title ?? ''}</Text>
			{details?.overview ? <Text style={styles.overview}>{details.overview}</Text> : null}

			<View style={styles.ratingRow} accessible accessibilityLabel="Seletor de avaliação, escolha de zero a cinco estrelas">
				{[1, 2, 3, 4, 5].map((i) => (
					<RatingStar key={i} filled={rating >= i * 2} onPress={() => setRating(i * 2)} label={`Definir ${i * 2} de 10`} />
				))}
				<Text style={styles.ratingText}>{rating}/10</Text>
			</View>

			<View style={styles.actions}>
				<Pressable
					onPress={onSave}
					style={({pressed}) => [styles.button, pressed && styles.pressed]}
					accessible
					accessibilityRole="button"
					accessibilityLabel="Salvar filme na lista de assistidos"
					hitSlop={8}>
					<Text style={styles.buttonText}>{existing ? 'Atualizar' : 'Salvar'}</Text>
				</Pressable>
				{existing ? (
					<Pressable
						onPress={onRemove}
						style={({pressed}) => [styles.remove, pressed && styles.pressed]}
						accessible
						accessibilityRole="button"
						accessibilityLabel="Remover filme da lista de assistidos"
						hitSlop={8}>
						<Text style={styles.buttonText}>Remover</Text>
					</Pressable>
				) : null}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {flex: 1, padding: 16, gap: 12},
	poster: {alignSelf: 'center', width: 200, height: 300, borderRadius: 12},
	title: {fontSize: 20, fontWeight: '700'},
	overview: {fontSize: 14, color: '#374151'},
	ratingRow: {flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8},
	star: {padding: 8, minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center'},
	starText: {fontSize: 24, color: '#6b7280'},
	starFilled: {color: '#f59e0b'},
	ratingText: {marginLeft: 8, fontWeight: '600'},
	actions: {flexDirection: 'row', gap: 12, marginTop: 8},
	button: {flex: 1, backgroundColor: '#111827', borderRadius: 8, paddingVertical: 14, alignItems: 'center', minHeight: 44},
	remove: {flex: 1, backgroundColor: '#b91c1c', borderRadius: 8, paddingVertical: 14, alignItems: 'center', minHeight: 44},
	buttonText: {color: '#fff', fontWeight: '700'},
	pressed: {opacity: 0.85},
});

export default MovieDetailsScreen;


