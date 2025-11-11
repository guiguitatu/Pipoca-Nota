import React, {useState} from 'react';
import {ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View, Image} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../navigation';
import {useMovies} from '../context/MoviesContext';

type Props = NativeStackScreenProps<AppStackParamList, 'Tabs'>;

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w200';

const SearchScreen: React.FC<Props> = ({navigation}) => {
	const {searchResults, isSearching, searchMovies} = useMovies();
	const [query, setQuery] = useState('');

	async function onSubmit() {
		await searchMovies(query);
	}

	return (
		<View style={styles.container} accessible accessibilityLabel="Tela de busca de filmes">
			<View style={styles.searchRow}>
				<TextInput
					placeholder="Buscar filmes..."
					value={query}
					onChangeText={setQuery}
					onSubmitEditing={onSubmit}
					style={styles.input}
					accessible
					accessibilityLabel="Campo de busca de filmes"
					returnKeyType="search"
				/>
				<Pressable
					onPress={onSubmit}
					style={({pressed}) => [styles.searchButton, pressed && styles.pressed]}
					accessible
					accessibilityRole="button"
					accessibilityLabel="Buscar"
					hitSlop={8}>
					<Text style={styles.searchText}>Buscar</Text>
				</Pressable>
			</View>

			{isSearching ? (
				<View style={styles.center}>
					<ActivityIndicator />
				</View>
			) : (
				<FlatList
					data={searchResults}
					keyExtractor={(item) => String(item.id)}
					renderItem={({item}) => (
						<Pressable
							onPress={() => navigation.navigate('MovieDetails', {movieId: item.id, title: item.title})}
							style={({pressed}) => [styles.item, pressed && styles.pressed]}
							accessible
							accessibilityRole="button"
							accessibilityLabel={`Abrir detalhes de ${item.title}`}
							hitSlop={8}>
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
							<View style={styles.meta}>
								<Text style={styles.title}>{item.title}</Text>
								{item.overview ? <Text numberOfLines={2} style={styles.overview}>{item.overview}</Text> : null}
							</View>
						</Pressable>
					)}
					contentContainerStyle={{paddingVertical: 8}}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {flex: 1, padding: 12},
	searchRow: {flexDirection: 'row', gap: 8, marginBottom: 8},
	input: {
		flex: 1,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 12,
		fontSize: 16,
	},
	searchButton: {backgroundColor: '#111827', borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center', minWidth: 88},
	searchText: {color: '#fff', fontWeight: '600'},
	center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
	item: {flexDirection: 'row', gap: 12, padding: 8, alignItems: 'center'},
	pressed: {opacity: 0.85},
	poster: {width: 64, height: 96, borderRadius: 8, backgroundColor: '#eee'},
	posterFallback: {backgroundColor: '#e5e7eb'},
	meta: {flex: 1},
	title: {fontSize: 16, fontWeight: '600', marginBottom: 4},
	overview: {fontSize: 12, color: '#6b7280'},
});

export default SearchScreen;


