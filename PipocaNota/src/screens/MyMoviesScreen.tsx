import React from 'react';
import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useMovies} from '../context/MoviesContext';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w200';

const MyMoviesScreen: React.FC = () => {
	const {watched, removeWatched} = useMovies();

	return (
		<View style={styles.container} accessible accessibilityLabel="Tela de filmes assistidos do usuário atual">
			<FlatList
				data={watched}
				keyExtractor={(item) => String(item.id)}
				renderItem={({item}) => (
					<View style={styles.item}>
						{item.poster_path ? (
							<Image
								source={{uri: `${IMAGE_BASE}${item.poster_path}`}}
								style={styles.poster}
								accessible
								accessibilityLabel={`Pôster do filme ${item.title}`}
							/>
						) : (
							<View style={[styles.poster, styles.posterFallback]} />
						)}
						<View style={{flex: 1}}>
							<Text style={styles.title}>{item.title}</Text>
							<Text style={styles.rating}>Nota: {item.rating}/10</Text>
						</View>
						<Pressable
							onPress={() => removeWatched(item.id)}
							style={({pressed}) => [styles.remove, pressed && styles.pressed]}
							accessible
							accessibilityRole="button"
							accessibilityLabel={`Remover ${item.title} da lista`}
							hitSlop={8}>
							<Text style={styles.removeText}>Remover</Text>
						</Pressable>
					</View>
				)}
				contentContainerStyle={{paddingVertical: 8}}
				ListEmptyComponent={
					<View style={styles.empty}>
						<Text style={styles.emptyText}>Nenhum filme ainda. Salve sua primeira avaliação!</Text>
					</View>
				}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {flex: 1, padding: 12},
	item: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8},
	poster: {width: 64, height: 96, borderRadius: 8},
	posterFallback: {backgroundColor: '#e5e7eb'},
	title: {fontSize: 16, fontWeight: '600'},
	rating: {fontSize: 12, color: '#6b7280'},
	remove: {backgroundColor: '#b91c1c', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, minHeight: 44, justifyContent: 'center'},
	removeText: {color: '#fff', fontWeight: '700'},
	pressed: {opacity: 0.85},
	empty: {alignItems: 'center', marginTop: 24},
	emptyText: {color: '#6b7280'},
});

export default MyMoviesScreen;


