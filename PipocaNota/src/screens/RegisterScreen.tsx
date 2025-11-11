import React, {useState} from 'react';
import {Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../navigation';
import {useAuth} from '../context/AuthContext';
import AccessibleImage from '../components/AccessibleImage';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = () => {
	const {register, pickImageFromLibrary, takePhotoWithCamera} = useAuth();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [profileImageUri, setProfileImageUri] = useState<string | undefined>(undefined);
	const [submitting, setSubmitting] = useState(false);

	async function onSubmit() {
		if (submitting) return;
		if (!name.trim() || !email.trim() || !password.trim()) {
			Alert.alert('Dados incompletos', 'Preencha nome, e-mail e senha.');
			return;
		}
		setSubmitting(true);
		try {
			await register({name, email, password, profileImageUri});
		} catch (e: any) {
			Alert.alert('Erro', e?.message ?? 'Falha ao cadastrar.');
		} finally {
			setSubmitting(false);
		}
	}

	async function onPickFromGallery() {
		try {
			const uri = await pickImageFromLibrary();
			if (uri) setProfileImageUri(uri);
		} catch {
			Alert.alert('Erro', 'Falha ao abrir galeria.');
		}
	}

	async function onTakePhoto() {
		try {
			const uri = await takePhotoWithCamera();
			if (uri) setProfileImageUri(uri);
		} catch {
			Alert.alert('Erro', 'Falha ao abrir câmera.');
		}
	}

	return (
		<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
			<View accessible accessibilityLabel="Tela de cadastro" style={styles.form}>
				<Text style={styles.title}>Criar conta</Text>

				<View style={styles.avatarRow}>
					{profileImageUri ? (
						<AccessibleImage
							alt="Foto de perfil"
							source={{uri: profileImageUri}}
							size={72}
							borderRadius={36}
						/>
					) : (
						<View
							style={styles.avatarFallback}
							accessible
							accessibilityRole="image"
							accessibilityLabel="Foto de perfil não definida"
						/>
					)}
					<View style={{gap: 8}}>
						<Pressable
							onPress={onPickFromGallery}
							style={({pressed}) => [styles.smallButton, pressed && styles.buttonPressed]}
							accessible
							accessibilityRole="button"
							accessibilityLabel="Escolher da galeria"
							hitSlop={8}>
							<Text style={styles.smallButtonText}>Galeria</Text>
						</Pressable>
						<Pressable
							onPress={onTakePhoto}
							style={({pressed}) => [styles.smallButton, pressed && styles.buttonPressed]}
							accessible
							accessibilityRole="button"
							accessibilityLabel="Tirar foto"
							hitSlop={8}>
							<Text style={styles.smallButtonText}>Câmera</Text>
						</Pressable>
					</View>
				</View>

				<TextInput
					placeholder="Nome"
					style={styles.input}
					value={name}
					onChangeText={setName}
					accessible
					accessibilityLabel="Campo de nome"
				/>
				<TextInput
					placeholder="E-mail"
					autoCapitalize="none"
					keyboardType="email-address"
					style={styles.input}
					value={email}
					onChangeText={setEmail}
					accessible
					accessibilityLabel="Campo de e-mail"
				/>
				<TextInput
					placeholder="Senha"
					secureTextEntry
					style={styles.input}
					value={password}
					onChangeText={setPassword}
					accessible
					accessibilityLabel="Campo de senha"
				/>
				<Pressable
					onPress={onSubmit}
					style={({pressed}) => [styles.button, pressed && styles.buttonPressed]}
					accessible
					accessibilityRole="button"
					accessibilityLabel="Concluir cadastro"
					hitSlop={8}>
					<Text style={styles.buttonText}>{submitting ? 'Cadastrando...' : 'Cadastrar'}</Text>
				</Pressable>
			</View>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {flex: 1, justifyContent: 'center', padding: 16},
	form: {gap: 12},
	title: {fontSize: 22, fontWeight: 'bold', marginBottom: 8, textAlign: 'center'},
	avatarRow: {flexDirection: 'row', alignItems: 'center', gap: 12, alignSelf: 'center', marginBottom: 8},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 12,
		fontSize: 16,
	},
	button: {
		backgroundColor: '#111827',
		borderRadius: 8,
		paddingVertical: 14,
		alignItems: 'center',
		minHeight: 44,
	},
	buttonPressed: {opacity: 0.85},
	buttonText: {color: '#fff', fontWeight: '600', fontSize: 16},
	smallButton: {
		backgroundColor: '#374151',
		borderRadius: 8,
		paddingVertical: 10,
		paddingHorizontal: 12,
		minHeight: 44,
		alignItems: 'center',
		justifyContent: 'center',
	},
	smallButtonText: {color: '#fff'},
	avatarFallback: {width: 72, height: 72, borderRadius: 36, backgroundColor: '#e5e7eb'},
});

export default RegisterScreen;


