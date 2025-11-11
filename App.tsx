import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { MoviesProvider } from './src/context/MoviesContext';
import { ThemeProvider, useThemePreference } from './src/context/ThemeContext';
import RootNavigator from './src/navigation/RootNavigator';

function AppInner() {
	const { navigationTheme, statusBarStyle } = useThemePreference();
	return (
		<NavigationContainer theme={navigationTheme}>
			<StatusBar style={statusBarStyle} />
			<RootNavigator />
		</NavigationContainer>
	);
}

export default function App() {
	return (
		<ThemeProvider>
			<AuthProvider>
				<MoviesProvider>
					<AppInner />
				</MoviesProvider>
			</AuthProvider>
		</ThemeProvider>
	);
}


