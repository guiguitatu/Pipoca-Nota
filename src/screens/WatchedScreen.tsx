import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, Pressable, Alert } from 'react-native';
import { useMovies } from '../context/MoviesContext';
import { TMDB_IMAGE_BASE } from '../services/tmdb';

export default function WatchedScreen() {
	const { watched, removeWatched } = useMovies();

	const onRemove = (id: number) => {
		Alert.alert('Remover', 'Deseja remover este filme da sua lista?', [
			{ text: 'Cancelar', style: 'cancel' },
			{ text: 'Remover', style: 'destructive', onPress: () => void removeWatched(id) }
		]);
	};

	return (
		<View style={{ flex: 1 }}>
			<FlatList
				data={watched}
				keyExtractor={item => String(item.id)}
				ListEmptyComponent={
					<View style={{ padding: 24 }}>
						<Text style={{ textAlign: 'center', color: '#64748b' }}>
							Você ainda não adicionou filmes assistidos.
						</Text>
					</View>
				}
				renderItem={({ item }) => (
					<View style={styles.row}>
						{item.posterPath ? (
							<Image
								source={{ uri: `${TMDB_IMAGE_BASE}${item.posterPath}` }}
								style={styles.poster}
								accessibilityLabel={`Pôster do filme ${item.title}`}
								accessibilityIgnoresInvertColors
							/>
						) : (
							<View style={[styles.poster, styles.posterPlaceholder]} accessibilityLabel="Filme sem pôster disponível" />
						)}
						<View style={{ flex: 1 }}>
							<Text style={styles.title}>{item.title}</Text>
							<Text style={styles.note}>Sua nota: {item.rating}</Text>
							<Text style={styles.date}>Em {new Date(item.ratedAt).toLocaleDateString()}</Text>
						</View>
						<Pressable
							accessibilityRole="button"
							accessibilityLabel={`Remover ${item.title} da sua lista`}
							onPress={() => onRemove(item.id)}
							style={({ pressed }) => [styles.removeButton, pressed && { opacity: 0.9 }]}
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
		backgroundColor: '#f8fafc',
		borderRadius: 12,
		padding: 10,
		alignItems: 'center'
	},
	poster: { width: 64, height: 96, borderRadius: 8, backgroundColor: '#e5e7eb' },
	posterPlaceholder: { justifyContent: 'center', alignItems: 'center' },
	title: { fontSize: 16, fontWeight: '700' },
	note: { color: '#334155' },
	date: { color: '#64748b', fontSize: 12 },
	removeButton: { backgroundColor: '#ef4444', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, minHeight: 44, minWidth: 44, justifyContent: 'center' },
	removeText: { color: 'white', fontWeight: '700' }
});


