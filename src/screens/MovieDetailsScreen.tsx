import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, TextInput, Alert, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { TMDB_IMAGE_BASE, getMovieDetails } from '../services/tmdb';
import { useMovies } from '../context/MoviesContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export default function MovieDetailsScreen({ route }: Props) {
	const { id, posterPath } = route.params;
	const [movie, setMovie] = useState<any | null>(null);
	const [rating, setRating] = useState<string>('10');
	const { saveRating, watched } = useMovies();

	useEffect(() => {
		getMovieDetails(id).then(setMovie).catch(() => {});
	}, [id]);

	useEffect(() => {
		const exists = watched.find(w => w.id === id);
		if (exists) setRating(String(exists.rating));
	}, [watched, id]);

	const onSave = async () => {
		const value = Number(rating);
		if (Number.isNaN(value) || value < 0 || value > 10) {
			Alert.alert('Avaliação', 'Informe uma nota entre 0 e 10.');
			return;
		}
		await saveRating({
			id,
			title: movie?.title ?? '',
			posterPath: posterPath || movie?.poster_path,
			rating: value
		});
		Alert.alert('Salvo', 'Filme salvo na sua lista de assistidos.');
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			{posterPath || movie?.poster_path ? (
				<Image
					source={{ uri: `${TMDB_IMAGE_BASE}${posterPath || movie?.poster_path}` }}
					style={styles.poster}
					accessibilityLabel={`Pôster do filme ${movie?.title ?? ''}`}
					accessibilityIgnoresInvertColors
				/>
			) : (
				<View style={[styles.poster, styles.posterPlaceholder]} accessibilityLabel="Filme sem pôster disponível" />
			)}
			<Text style={styles.title}>{movie?.title}</Text>
			<Text style={styles.subtitle}>{movie?.release_date}</Text>
			<Text style={styles.overview}>{movie?.overview}</Text>

			<View style={styles.rateRow}>
				<Text style={styles.rateLabel}>Sua nota (0-10):</Text>
				<TextInput
					accessibilityLabel="Campo para informar sua avaliação de zero a dez"
					keyboardType="numeric"
					style={styles.rateInput}
					value={rating}
					onChangeText={setRating}
					maxLength={4}
				/>
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Salvar filme na lista de assistidos"
					onPress={onSave}
					style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
				>
					<Text style={styles.buttonText}>Salvar</Text>
				</Pressable>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { padding: 16, gap: 12 },
	poster: { width: '100%', height: 460, borderRadius: 12, backgroundColor: '#e5e7eb' },
	posterPlaceholder: { justifyContent: 'center', alignItems: 'center' },
	title: { fontSize: 22, fontWeight: '800', marginTop: 8 },
	subtitle: { color: '#64748b' },
	overview: { fontSize: 14, lineHeight: 20 },
	rateRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
	rateLabel: { fontSize: 14 },
	rateInput: {
		borderWidth: 1,
		borderColor: '#cbd5e1',
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 16,
		width: 80
	},
	button: { backgroundColor: '#16a34a', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, minHeight: 44, minWidth: 44 },
	buttonPressed: { opacity: 0.9 },
	buttonText: { color: 'white', fontWeight: '700' }
});


