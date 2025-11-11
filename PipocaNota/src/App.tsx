import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthProvider} from './context/AuthContext';
import {MoviesProvider} from './context/MoviesContext';
import RootNavigator from './navigation';

const App = () => {
	return (
		<SafeAreaProvider>
			<AuthProvider>
				<MoviesProvider>
					<NavigationContainer theme={DefaultTheme}>
						<RootNavigator />
					</NavigationContainer>
				</MoviesProvider>
			</AuthProvider>
		</SafeAreaProvider>
	);
};

export default App;


