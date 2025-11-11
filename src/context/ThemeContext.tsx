import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DefaultTheme as BaseLightTheme, DarkTheme as BaseDarkTheme, Theme as NavTheme } from '@react-navigation/native';
import type { ColorSchemeName } from 'react-native';
import { Appearance } from 'react-native';

type AppColors = {
	background: string;
	surface: string;
	overlay: string;
	text: string;
	textMuted: string;
	border: string;
	primary: string;
	danger: string;
	inputBackground: string;
	inputText: string;
	inputPlaceholder: string;
	listItem: string;
	card: string;
};

type ThemeContextValue = {
	isDark: boolean;
	mode: 'light' | 'dark';
	setDark: (enabled: boolean) => Promise<void>;
	navigationTheme: NavTheme;
	statusBarStyle: 'light' | 'dark';
	colors: AppColors;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'pipoca_nota_theme_mode';

const lightPalette: AppColors = {
	background: '#f4f5f7',
	surface: '#ffffff',
	overlay: 'rgba(15, 23, 42, 0.04)',
	text: '#0f172a',
	textMuted: '#475569',
	border: '#d0d7e2',
	primary: '#2563eb',
	danger: '#ef4444',
	inputBackground: '#ffffff',
	inputText: '#0f172a',
	inputPlaceholder: '#94a3b8',
	listItem: '#ffffff',
	card: '#ffffff'
};

const darkPalette: AppColors = {
	background: '#111827',
	surface: '#161e2e',
	overlay: 'rgba(148, 163, 184, 0.08)',
	text: '#f8fafc',
	textMuted: '#cbd5f5',
	border: '#1f2a3d',
	primary: '#38bdf8',
	danger: '#f87171',
	inputBackground: '#1f2937',
	inputText: '#f8fafc',
	inputPlaceholder: '#93a4c1',
	listItem: '#1c2535',
	card: '#1f2937'
};

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const system: ColorSchemeName = Appearance.getColorScheme();
	const [mode, setMode] = useState<'light' | 'dark'>(system === 'dark' ? 'dark' : 'light');

	useEffect(() => {
		(async () => {
			try {
				const saved = await AsyncStorage.getItem(STORAGE_KEY);
				if (saved === 'light' || saved === 'dark') {
					setMode(saved);
				}
			} catch {}
		})();
	}, []);

	const setDark = useCallback(async (enabled: boolean) => {
		const next = enabled ? 'dark' as const : 'light' as const;
		setMode(next);
		try {
			await AsyncStorage.setItem(STORAGE_KEY, next);
		} catch {}
	}, []);

	const isDark = mode === 'dark';
	const palette = isDark ? darkPalette : lightPalette;

	const navigationTheme: NavTheme = useMemo(() => ({
		...(isDark ? BaseDarkTheme : BaseLightTheme),
		colors: {
			...(isDark ? BaseDarkTheme.colors : BaseLightTheme.colors),
			background: palette.background,
			card: palette.card,
			border: palette.border,
			primary: palette.primary,
			text: palette.text,
			notification: palette.danger
		}
	}), [isDark, palette]);

	const statusBarStyle: 'light' | 'dark' = isDark ? 'light' : 'dark';

	const value = useMemo<ThemeContextValue>(() => ({
		isDark,
		mode,
		setDark,
		navigationTheme,
		statusBarStyle,
		colors: palette
	}), [isDark, mode, setDark, navigationTheme, statusBarStyle, palette]);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useThemePreference(): ThemeContextValue {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error('useThemePreference must be used within ThemeProvider');
	return ctx;
}

