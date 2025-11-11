import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
	const { currentUser, signOut } = useAuth();
	if (!currentUser) return null;
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				{currentUser.profileImageUri ? (
					<Image
						source={{ uri: currentUser.profileImageUri }}
						style={styles.avatar}
						accessibilityLabel={`Foto de perfil de ${currentUser.name}`}
						accessibilityIgnoresInvertColors
					/>
				) : (
					<View style={[styles.avatar, styles.avatarPlaceholder]} accessibilityLabel="Usuário sem foto de perfil" />
				)}
				<View>
					<Text style={styles.name}>{currentUser.name}</Text>
					<Text style={styles.email}>{currentUser.email}</Text>
				</View>
			</View>

			<Pressable
				accessibilityRole="button"
				accessibilityLabel="Sair da conta"
				onPress={signOut}
				style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
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
	button: { backgroundColor: '#ef4444', paddingVertical: 14, borderRadius: 10, alignItems: 'center', minHeight: 44, minWidth: 44 },
	buttonPressed: { opacity: 0.9 },
	buttonText: { color: 'white', fontSize: 16, fontWeight: '600' }
});


