import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image, AccessibilityInfo, findNodeHandle } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export default function SignupScreen({ navigation }: Props) {
	const { signUp } = useAuth();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [imageUri, setImageUri] = useState<string | undefined>(undefined);
	const nameRef = useRef<TextInput>(null);

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.7,
			mediaTypes: ImagePicker.MediaTypeOptions.Images
		});
		if (!result.canceled) {
			setImageUri(result.assets[0].uri);
		}
	};

	const takePhoto = async () => {
		const result = await ImagePicker.launchCameraAsync({
			quality: 0.7,
			allowsEditing: true,
			aspect: [1, 1]
		});
		if (!result.canceled) {
			setImageUri(result.assets[0].uri);
		}
	};

	const onSubmit = async () => {
		await signUp({ name, email: email.trim(), password, profileImageUri: imageUri });
		navigation.reset({
			index: 0,
			routes: [{ name: 'Main' }],
		});
	};

	const focusName = () => {
		const node = findNodeHandle(nameRef.current);
		if (node) AccessibilityInfo.setAccessibilityFocus(node);
	};

	return (
		<View style={styles.container}>
			<Text accessibilityRole="header" style={styles.title}>Criar conta</Text>

			<View style={styles.avatarRow}>
				{imageUri ? (
					<Image
						source={{ uri: imageUri }}
						style={styles.avatar}
						accessibilityIgnoresInvertColors
						accessibilityLabel="Foto de perfil selecionada"
					/>
				) : (
					<View style={[styles.avatar, styles.avatarPlaceholder]} accessibilityLabel="Sem foto de perfil" />
				)}
				<View style={{ gap: 8 }}>
					<Pressable accessibilityRole="button" accessibilityLabel="Escolher da galeria" style={styles.smallButton} onPress={pickImage}>
						<Text style={styles.smallButtonText}>Escolher</Text>
					</Pressable>
					<Pressable accessibilityRole="button" accessibilityLabel="Tirar foto com a câmera" style={styles.smallButton} onPress={takePhoto}>
						<Text style={styles.smallButtonText}>Câmera</Text>
					</Pressable>
				</View>
			</View>

			<Text style={styles.label}>Nome</Text>
			<TextInput
				ref={nameRef}
				accessibilityLabel="Campo de nome"
				placeholder="Seu nome"
				style={styles.input}
				value={name}
				onChangeText={setName}
				onFocus={focusName}
			/>

			<Text style={styles.label}>E-mail</Text>
			<TextInput
				accessibilityLabel="Campo de e-mail"
				autoCapitalize="none"
				autoComplete="email"
				keyboardType="email-address"
				placeholder="seu@email.com"
				style={styles.input}
				value={email}
				onChangeText={setEmail}
			/>

			<Text style={styles.label}>Senha</Text>
			<TextInput
				accessibilityLabel="Campo de senha"
				secureTextEntry
				placeholder="Crie uma senha"
				style={styles.input}
				value={password}
				onChangeText={setPassword}
			/>

			<Pressable accessibilityRole="button" accessibilityLabel="Concluir cadastro" onPress={onSubmit} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
				<Text style={styles.buttonText}>Cadastrar</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20 },
	title: { fontSize: 24, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
	avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
	avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#e5e7eb' },
	avatarPlaceholder: { justifyContent: 'center', alignItems: 'center' },
	label: { fontSize: 14, marginTop: 12, marginBottom: 6 },
	input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16 },
	button: { marginTop: 20, backgroundColor: '#16a34a', paddingVertical: 14, borderRadius: 10, alignItems: 'center', minHeight: 44, minWidth: 44 },
	buttonPressed: { opacity: 0.9 },
	buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
	smallButton: { backgroundColor: '#3b82f6', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center' },
	smallButtonText: { color: 'white', fontWeight: '600' }
});


