import React, {useState} from 'react';
import {Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../navigation';
import {useAuth} from '../context/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({navigation}) => {
	const {login} = useAuth();
	const [email, setEmail] = useState('');
	const [thePassword, setThePassword] = useState('');
	const [submitting, setSubmitting] = useState(false);

	async function onSubmit() {
		if (submitting) return;
		setSubmitting(true);
		try {
			await login(email, thePassword);
		} catch (e: any) {
			Alert.alert('Erro', e?.message ?? 'Falha ao entrar.');
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
			<View accessible accessibilityLabel="Tela de login" style={styles.form}>
				<Text style={styles.title}>Pipoca & Nota</Text>
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
					value={thePassword}
					onChangeText={setThePassword}
					accessible
					accessibilityLabel="Campo de senha"
				/>
				<Pressable
					onPress={onSubmit}
					style={({pressed}) => [styles.button, pressed && styles.buttonPressed]}
					accessible
					accessibilityRole="button"
					accessibilityLabel="Entrar"
					hitSlop={8}>
					<Text style={styles.buttonText}>{submitting ? 'Entrando...' : 'Entrar'}</Text>
				</Pressable>
				<Pressable
					onPress={() => navigation.navigate('Register')}
					style={({pressed}) => [styles.link, pressed && styles.linkPressed]}
					accessible
					accessibilityRole="button"
					accessibilityLabel="Ir para cadastro"
					hitSlop={8}>
					<Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
				</Pressable>
			</View>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {flex: 1, justifyContent: 'center', padding: 16},
	form: {gap: 12},
	title: {fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center'},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 12, // >=44 logical height
		fontSize: 16,
	},
	button: {
		backgroundColor: '#111827',
		borderRadius: 8,
		paddingVertical: 14,
		alignItems: 'center',
+		minHeight: 44,
	},
	buttonPressed: {opacity: 0.85},
	buttonText: {color: '#fff', fontWeight: '600', fontSize: 16},
	link: {alignItems: 'center', paddingVertical: 8},
	linkPressed: {opacity: 0.7},
	linkText: {color: '#2563eb', fontSize: 14},
});

export default LoginScreen;


