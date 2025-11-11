import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, AccessibilityInfo, findNodeHandle } from 'react-native';
import { useAuth } from '../context/AuthContext';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

export default function LoginScreen({ navigation }: Props) {
	const { signIn } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const emailRef = useRef<TextInput>(null);

	const onSubmit = async () => {
		await signIn(email.trim(), password);
	};

	const focusEmail = () => {
		const node = findNodeHandle(emailRef.current);
		if (node) AccessibilityInfo.setAccessibilityFocus(node);
	};

	return (
		<View style={styles.container}>
			<Text accessibilityRole="header" style={styles.title}>Pipoca & Nota</Text>

			<Text style={styles.label}>E-mail</Text>
			<TextInput
				ref={emailRef}
				accessibilityLabel="Campo de e-mail"
				autoCapitalize="none"
				autoComplete="email"
				keyboardType="email-address"
				placeholder="seu@email.com"
				style={styles.input}
				value={email}
				onChangeText={setEmail}
				onFocus={focusEmail}
			/>

			<Text style={styles.label}>Senha</Text>
			<TextInput
				accessibilityLabel="Campo de senha"
				secureTextEntry
				placeholder="Sua senha"
				style={styles.input}
				value={password}
				onChangeText={setPassword}
			/>

			<Pressable
				accessibilityRole="button"
				accessibilityLabel="Entrar"
				onPress={onSubmit}
				style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
			>
				<Text style={styles.buttonText}>Entrar</Text>
			</Pressable>

			<Pressable
				accessibilityRole="button"
				accessibilityLabel="Não tenho conta. Ir para cadastro."
				onPress={() => navigation.navigate('Signup')}
				style={styles.link}
			>
				<Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, justifyContent: 'center' },
	title: { fontSize: 28, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
	label: { fontSize: 14, marginTop: 12, marginBottom: 6 },
	input: {
		borderWidth: 1,
		borderColor: '#cbd5e1',
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 12,
		fontSize: 16
	},
	button: {
		marginTop: 20,
		backgroundColor: '#3b82f6',
		paddingVertical: 14,
		borderRadius: 10,
		alignItems: 'center',
		minWidth: 44,
		minHeight: 44
	},
	buttonPressed: { opacity: 0.9 },
	buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
	link: { marginTop: 16, alignItems: 'center' },
	linkText: { color: '#3b82f6', fontSize: 14, fontWeight: '600' }
});


