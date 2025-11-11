import React, { useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Pressable, Alert } from 'react-native';
import { useMovies } from '../context/MoviesContext';
import { TMDB_IMAGE_BASE } from '../services/tmdb';
import { useThemePreference } from '../context/ThemeContext';

export default function WatchedScreen() {
	const { watched, removeWatched } = useMovies();
	const { colors: palette } = useThemePreference();

	const onRemove = useCallback(async (id: number, title: string) => {
		try {
			await removeWatched(id);
			Alert.alert('Removido', `${title} foi removido da sua lista.`);
		} catch {
			Alert.alert('Erro', 'Não foi possível remover este filme.');
		}
	}, [removeWatched]);

	return (
		<View style={{ flex: 1, backgroundColor: palette.background }}>
			<FlatList
				data={watched}
				keyExtractor={item => String(item.id)}
				ListEmptyComponent={
					<View style={{ padding: 24 }}>
						<Text style={{ textAlign: 'center', color: palette.textMuted }}>
							Você ainda não adicionou filmes assistidos.
						</Text>
					</View>
				}
				renderItem={({ item }) => (
					<View style={[
						styles.row,
						{ backgroundColor: palette.listItem, borderColor: palette.border }
					]}>
						{item.posterPath ? (
							<Image
								source={{ uri: `${TMDB_IMAGE_BASE}${item.posterPath}` }}
								style={[styles.poster, { backgroundColor: palette.overlay }]}
								accessibilityLabel={`Pôster do filme ${item.title}`}
								accessibilityIgnoresInvertColors
							/>
						) : (
							<View style={[styles.poster, styles.posterPlaceholder]} accessibilityLabel="Filme sem pôster disponível" />
						)}
						<View style={{ flex: 1 }}>
							<Text style={[styles.title, { color: palette.text }]}>{item.title}</Text>
							<Text style={[styles.note, { color: palette.text }]}>{`Sua nota: ${item.rating}`}</Text>
							<Text style={[styles.date, { color: palette.textMuted }]}>Em {new Date(item.ratedAt).toLocaleDateString()}</Text>
						</View>
						<Pressable
							accessibilityRole="button"
							accessibilityLabel={`Remover ${item.title} da sua lista`}
							onPress={() => { void onRemove(item.id, item.title); }}
							style={({ pressed }) => [
								styles.removeButton,
								{ backgroundColor: palette.danger },
								pressed && { opacity: 0.9 }
							]}
						>
							<Text style={styles.removeText}>Remover</Text>
						</Pressable>
					</View>
				)}
				contentContainerStyle={{ padding: 16 }}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		gap: 12,
		marginBottom: 12,
		borderWidth: 1,
		borderRadius: 12,
		padding: 10,
		alignItems: 'center'
	},
	poster: { width: 64, height: 96, borderRadius: 8, backgroundColor: '#e5e7eb' },
	posterPlaceholder: { justifyContent: 'center', alignItems: 'center' },
	title: { fontSize: 16, fontWeight: '700' },
	note: {},
	date: { fontSize: 12 },
	removeButton: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, minHeight: 44, minWidth: 44, justifyContent: 'center' },
	removeText: { color: 'white', fontWeight: '700' }
});


