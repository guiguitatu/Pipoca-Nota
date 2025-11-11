import React, { useMemo, useState } from 'react';
import { View, TextInput, FlatList, Image, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { TMDB_IMAGE_BASE, searchMovies } from '../services/tmdb';
import { useThemePreference } from '../context/ThemeContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function SearchScreen() {
	const navigation = useNavigation<Nav>();
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const { colors: palette } = useThemePreference();

	const onSearch = async (text: string) => {
		setQuery(text);
		if (text.trim().length < 2) {
			setResults([]);
			return;
		}
		setLoading(true);
		try {
			const data = await searchMovies(text.trim());
			setResults(data);
		} finally {
			setLoading(false);
		}
	};

	const listEmpty = useMemo(
		() => (
			<View style={{ padding: 24 }}>
				<Text style={{ textAlign: 'center', color: palette.textMuted }}>
					Digite para buscar filmes no catálogo TMDb.
				</Text>
			</View>
		),
		[palette.textMuted]
	);

	return (
		<View style={{ flex: 1, backgroundColor: palette.background }}>
			<View style={[styles.searchBar, { borderBottomColor: palette.border, backgroundColor: palette.surface }]}>
				<TextInput
					placeholder="Buscar filmes..."
					accessibilityLabel="Buscar filmes"
					style={[
						styles.input,
						{
							backgroundColor: palette.inputBackground,
							color: palette.inputText,
							borderColor: palette.border
						}
					]}
					value={query}
					onChangeText={onSearch}
					returnKeyType="search"
					placeholderTextColor={palette.inputPlaceholder}
				/>
			</View>
			<FlatList
				data={results}
				keyExtractor={(item) => String(item.id)}
				ListEmptyComponent={loading ? null : listEmpty}
				renderItem={({ item }) => (
					<Pressable
						accessibilityRole="button"
						accessibilityLabel={`Ver detalhes do filme ${item.title}`}
						onPress={() => navigation.navigate('Details', { id: item.id, title: item.title, posterPath: item.poster_path || undefined })}
						style={({ pressed }) => [
							styles.row,
							{
								backgroundColor: palette.listItem,
								borderColor: palette.border
							},
							pressed && { opacity: 0.85 }
						]}
					>
						{item.poster_path ? (
							<Image
								source={{ uri: `${TMDB_IMAGE_BASE}${item.poster_path}` }}
								style={[styles.poster, { backgroundColor: palette.overlay }]}
								accessibilityLabel={`Pôster do filme ${item.title}`}
								accessibilityIgnoresInvertColors
							/>
						) : (
							<View style={[styles.poster, styles.posterPlaceholder]} accessibilityLabel="Filme sem pôster disponível" />
						)}
						<View style={{ flex: 1 }}>
							<Text style={[styles.title, { color: palette.text }]}>{item.title}</Text>
							<Text numberOfLines={2} style={[styles.overview, { color: palette.textMuted }]}>{item.overview}</Text>
						</View>
					</Pressable>
				)}
				contentContainerStyle={{ padding: 16 }}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	searchBar: { padding: 16, borderBottomWidth: 1 },
	input: {
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 12,
		fontSize: 16
	},
	row: {
		flexDirection: 'row',
		gap: 12,
		marginBottom: 12,
		borderWidth: 1,
		borderRadius: 12,
		padding: 10,
		minHeight: 44
	},
	poster: { width: 64, height: 96, borderRadius: 8, backgroundColor: '#e5e7eb' },
	posterPlaceholder: { justifyContent: 'center', alignItems: 'center' },
	title: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
	overview: { fontSize: 12 }
});


