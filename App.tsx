import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { MoviesProvider } from './src/context/MoviesContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
	const scheme = useColorScheme();
	return (
		<AuthProvider>
			<MoviesProvider>
				<NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
					<StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
					<RootNavigator />
				</NavigationContainer>
			</MoviesProvider>
		</AuthProvider>
	);
}


