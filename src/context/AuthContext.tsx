import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export type StoredUser = {
	id: string;
	name: string;
	email: string;
	password: string;
	profileImageUri?: string;
	createdAt: string;
};

type AuthContextType = {
	currentUser: StoredUser | null;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (user: Omit<StoredUser, 'id' | 'createdAt'> & { password: string }) => Promise<void>;
	signOut: () => Promise<void>;
	updateProfileImage: (uri: string | undefined) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'pipoca_nota_users';
const SESSION_KEY = 'pipoca_nota_session';

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);

	const loadSession = useCallback(async () => {
		const sessionJson = await AsyncStorage.getItem(SESSION_KEY);
		if (sessionJson) {
			const sessionUserId = JSON.parse(sessionJson) as string;
			const usersJson = await AsyncStorage.getItem(USERS_KEY);
			if (usersJson) {
				const users = JSON.parse(usersJson) as StoredUser[];
				const user = users.find(u => u.id === sessionUserId) ?? null;
				setCurrentUser(user);
			}
		}
	}, []);

	useEffect(() => {
		loadSession().catch(() => {});
	}, [loadSession]);

	const signIn = useCallback(async (email: string, password: string) => {
		const usersJson = await AsyncStorage.getItem(USERS_KEY);
		const users = usersJson ? (JSON.parse(usersJson) as StoredUser[]) : [];
		const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
		if (!user) {
			Alert.alert('Erro de login', 'E-mail ou senha inválidos.');
			return;
		}
		await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user.id));
		setCurrentUser(user);
	}, []);

	const signUp = useCallback(
		async (data: Omit<StoredUser, 'id' | 'createdAt'> & { password: string }) => {
			const usersJson = await AsyncStorage.getItem(USERS_KEY);
			const users = usersJson ? (JSON.parse(usersJson) as StoredUser[]) : [];
			const exists = users.some(u => u.email.toLowerCase() === data.email.toLowerCase());
			if (exists) {
				Alert.alert('Cadastro', 'Já existe um usuário com este e-mail.');
				return;
			}
			const newUser: StoredUser = {
				id: `u_${Date.now()}`,
				name: data.name,
				email: data.email,
				password: data.password,
				profileImageUri: data.profileImageUri,
				createdAt: new Date().toISOString()
			};
			const updated = [...users, newUser];
			await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updated));
			await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(newUser.id));
			setCurrentUser(newUser);
		},
		[]
	);

	const signOut = useCallback(async () => {
		await AsyncStorage.removeItem(SESSION_KEY);
		setCurrentUser(null);
	}, []);

	const updateProfileImage = useCallback(
		async (uri: string | undefined) => {
			if (!currentUser) return;
			const usersJson = await AsyncStorage.getItem(USERS_KEY);
			const users = usersJson ? (JSON.parse(usersJson) as StoredUser[]) : [];
			const idx = users.findIndex(u => u.id === currentUser.id);
			if (idx >= 0) {
				const updated: StoredUser = { ...currentUser, profileImageUri: uri };
				users[idx] = updated;
				await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
				setCurrentUser(updated);
			}
		},
		[currentUser]
	);

	const value = useMemo(
		() => ({ currentUser, signIn, signUp, signOut, updateProfileImage }),
		[currentUser, signIn, signUp, signOut, updateProfileImage]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
};


