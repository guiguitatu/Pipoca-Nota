import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useAuth} from '../context/AuthContext';
import AccessibleImage from '../components/AccessibleImage';

const ProfileScreen: React.FC = () => {
	const {currentUser, logout, pickImageFromLibrary, takePhotoWithCamera, updateProfileImage} = useAuth();

	if (!currentUser) return null;

	async function onPick() {
		const uri = await pickImageFromLibrary();
		await updateProfileImage(uri);
	}

	async function onCamera() {
		const uri = await takePhotoWithCamera();
		await updateProfileImage(uri);
	}

	return (
		<View style={styles.container} accessible accessibilityLabel="Tela de perfil do usuário">
			<View style={styles.header}>
				{currentUser.profileImageUri ? (
					<AccessibleImage
						alt="Foto de perfil do usuário"
						source={{uri: currentUser.profileImageUri}}
						size={96}
						borderRadius={48}
					/>
				) : (
					<View
						style={styles.avatarFallback}
						accessible
						accessibilityRole="image"
						accessibilityLabel="Foto de perfil não definida"
					/>
				)}
				<Text style={styles.name}>{currentUser.name}</Text>
				<Text style={styles.email}>{currentUser.email}</Text>
			</View>
			<View style={styles.actions}>
				<Pressable
					onPress={onPick}
					style={({pressed}) => [styles.button, pressed && styles.pressed]}
					accessible
					accessibilityRole="button"
					accessibilityLabel="Trocar foto pela galeria"
					hitSlop={8}>
					<Text style={styles.buttonText}>Galeria</Text>
				</Pressable>
				<Pressable
					onPress={onCamera}
					style={({pressed}) => [styles.button, pressed && styles.pressed]}
					accessible
					accessibilityRole="button"
					accessibilityLabel="Tirar nova foto"
					hitSlop={8}>
					<Text style={styles.buttonText}>Câmera</Text>
				</Pressable>
				<Pressable
					onPress={logout}
					style={({pressed}) => [styles.logout, pressed && styles.pressed]}
					accessible
					accessibilityRole="button"
					accessibilityLabel="Sair do aplicativo"
					hitSlop={8}>
					<Text style={styles.logoutText}>Sair</Text>
				</Pressable>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {flex: 1, padding: 16},
	header: {alignItems: 'center', gap: 8, marginTop: 16},
	name: {fontSize: 20, fontWeight: '700'},
	email: {fontSize: 14, color: '#6b7280'},
	actions: {marginTop: 24, gap: 12},
	button: {backgroundColor: '#111827', borderRadius: 8, paddingVertical: 14, alignItems: 'center', minHeight: 44},
	buttonText: {color: '#fff', fontWeight: '600'},
	logout: {backgroundColor: '#b91c1c', borderRadius: 8, paddingVertical: 14, alignItems: 'center', minHeight: 44},
	logoutText: {color: '#fff', fontWeight: '700'},
	pressed: {opacity: 0.85},
	avatarFallback: {width: 96, height: 96, borderRadius: 48, backgroundColor: '#e5e7eb'},
});

export default ProfileScreen;


