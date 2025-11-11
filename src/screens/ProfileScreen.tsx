import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Switch } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useThemePreference } from '../context/ThemeContext';

export default function ProfileScreen() {
	const { colors: palette, isDark, setDark } = useThemePreference();
	const { currentUser, signOut } = useAuth();
	if (!currentUser) return null;
	return (
		<View style={[styles.container, { backgroundColor: palette.background }]}>
			<View style={styles.header}>
				{currentUser.profileImageUri ? (
					<Image
						source={{ uri: currentUser.profileImageUri }}
						style={[styles.avatar, { backgroundColor: palette.overlay }]}
						accessibilityLabel={`Foto de perfil de ${currentUser.name}`}
						accessibilityIgnoresInvertColors
					/>
				) : (
					<View style={[styles.avatar, styles.avatarPlaceholder, { backgroundColor: palette.overlay }]} accessibilityLabel="Usuário sem foto de perfil" />
				)}
				<View>
					<Text style={[styles.name, { color: palette.text }]}>{currentUser.name}</Text>
					<Text style={[styles.email, { color: palette.textMuted }]}>{currentUser.email}</Text>
				</View>
			</View>

			<View style={[styles.row, { backgroundColor: palette.surface, borderColor: palette.border }]}>
				<Text style={[styles.rowLabel, { color: palette.text }]}>Modo escuro</Text>
				<Switch
					accessibilityRole="switch"
					accessibilityLabel="Ativar ou desativar modo escuro"
					value={isDark}
					onValueChange={value => { void setDark(value); }}
					thumbColor={isDark ? palette.primary : '#ffffff'}
					trackColor={{ false: palette.overlay, true: palette.primary }}
				/>
			</View>

			<Pressable
				accessibilityRole="button"
				accessibilityLabel="Sair da conta"
				onPress={signOut}
				style={({ pressed }) => [
					styles.button,
					{ backgroundColor: palette.danger },
					pressed && styles.buttonPressed
				]}
			>
				<Text style={styles.buttonText}>Sair</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20 },
	header: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 16, marginBottom: 24 },
	avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#e5e7eb' },
	avatarPlaceholder: { justifyContent: 'center', alignItems: 'center' },
	name: { fontSize: 20, fontWeight: '700' },
	email: { fontSize: 14, color: '#64748b' },
	row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 16, marginBottom: 16, borderRadius: 12, borderWidth: 1 },
	rowLabel: { fontSize: 16, fontWeight: '600' },
	button: { paddingVertical: 14, borderRadius: 10, alignItems: 'center', minHeight: 44, minWidth: 44 },
	buttonPressed: { opacity: 0.9 },
	buttonText: { color: 'white', fontSize: 16, fontWeight: '600' }
});


