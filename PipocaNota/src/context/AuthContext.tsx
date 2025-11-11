import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera, launchImageLibrary, ImagePickerResponse, CameraOptions, ImageLibraryOptions} from 'react-native-image-picker';

export type User = {
	id: string;
	name: string;
	email: string;
	passwordHash: string;
	profileImageUri?: string;
};

type AuthContextValue = {
	currentUser: User | null;
	register: (params: {name: string; email: string; password: string; profileImageUri?: string}) => Promise<void>;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	updateProfileImage: (uri: string | undefined) => Promise<void>;
	pickImageFromLibrary: () => Promise<string | undefined>;
	takePhotoWithCamera: () => Promise<string | undefined>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USERS_KEY = 'pipoca_nota_users_v1';
const CURRENT_USER_KEY = 'pipoca_nota_current_user_email_v1';

function hashPassword(plain: string): string {
	// Simple hash for demo purposes only. Do not use in production.
	const base = Buffer.from(plain).toString('base64');
	return `h_${base}`;
}

async function readUsers(): Promise<Record<string, User>> {
	const raw = await AsyncStorage.getItem(USERS_KEY);
	return raw ? JSON.parse(raw) : {};
}

async function writeUsers(users: Record<string, User>): Promise<void> {
	await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({children}) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);

	useEffect(() => {
		(async () => {
			const email = await AsyncStorage.getItem(CURRENT_USER_KEY);
			if (!email) return;
			const users = await readUsers();
			if (email in users) {
				setCurrentUser(users[email]);
			}
		})();
	}, []);

	const register = useCallback(async (params: {name: string; email: string; password: string; profileImageUri?: string}) => {
		const users = await readUsers();
		const key = params.email.trim().toLowerCase();
		if (users[key]) {
			throw new Error('E-mail já cadastrado.');
		}
		const user: User = {
			id: key,
			name: params.name.trim(),
			email: key,
			passwordHash: hashPassword(params.password),
			profileImageUri: params.profileImageUri,
		};
		users[key] = user;
		await writeUsers(users);
		await AsyncStorage.setItem(CURRENT_USER_KEY, key);
		setCurrentUser(user);
	}, []);

	const login = useCallback(async (email: string, password: string) => {
		const users = await readUsers();
		const key = email.trim().toLowerCase();
		const user = users[key];
		if (!user || user.passwordHash !== hashPassword(password)) {
			throw new Error('Credenciais inválidas.');
		}
		await AsyncStorage.setItem(CURRENT_USER_KEY, key);
		setCurrentUser(user);
	}, []);

	const logout = useCallback(async () => {
		await AsyncStorage.removeItem(CURRENT_USER_KEY);
		setCurrentUser(null);
	}, []);

	const updateProfileImage = useCallback(async (uri: string | undefined) => {
		if (!currentUser) return;
		const users = await readUsers();
		const existing = users[currentUser.email];
		if (!existing) return;
		const updated: User = {...existing, profileImageUri: uri};
		users[currentUser.email] = updated;
		await writeUsers(users);
		setCurrentUser(updated);
	}, [currentUser]);

	const pickImageFromLibrary = useCallback(async (): Promise<string | undefined> => {
		const options: ImageLibraryOptions = {mediaType: 'photo', selectionLimit: 1, quality: 0.8};
		const result: ImagePickerResponse = await launchImageLibrary(options);
		const uri = result.assets?.[0]?.uri;
		return uri;
	}, []);

	const takePhotoWithCamera = useCallback(async (): Promise<string | undefined> => {
		const options: CameraOptions = {mediaType: 'photo', quality: 0.8, saveToPhotos: true};
		const result: ImagePickerResponse = await launchCamera(options);
		const uri = result.assets?.[0]?.uri;
		return uri;
	}, []);

	const value = useMemo<AuthContextValue>(() => ({
		currentUser,
		register,
		login,
		logout,
		updateProfileImage,
		pickImageFromLibrary,
		takePhotoWithCamera,
	}), [currentUser, login, logout, register, takePhotoWithCamera, pickImageFromLibrary, updateProfileImage]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return ctx;
}


