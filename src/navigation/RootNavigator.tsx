import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WatchedScreen from '../screens/WatchedScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import { Pressable, Text } from 'react-native';

export type RootStackParamList = {
	Auth: undefined;
	Main: undefined;
	Details: { id: number; title: string; posterPath?: string };
	Signup: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
	return (
		<Tab.Navigator screenOptions={{ headerShown: false }}>
			<Tab.Screen
				name="Buscar"
				component={SearchScreen}
				options={{ tabBarAccessibilityLabel: 'Aba de busca de filmes', tabBarLabel: 'Buscar' }}
			/>
			<Tab.Screen
				name="Assistidos"
				component={WatchedScreen}
				options={{ tabBarAccessibilityLabel: 'Aba de filmes assistidos', tabBarLabel: 'Assistidos' }}
			/>
			<Tab.Screen
				name="Perfil"
				component={ProfileScreen}
				options={{ tabBarAccessibilityLabel: 'Aba de perfil do usuário', tabBarLabel: 'Perfil' }}
			/>
		</Tab.Navigator>
	);
}

export default function RootNavigator() {
	const { currentUser } = useAuth();

	return (
		<Stack.Navigator>
			{!currentUser ? (
				<Stack.Screen
					name="Auth"
					component={LoginScreen}
					options={({ navigation }) => ({
						title: 'Entrar',
						headerRight: () => (
							<Pressable accessibilityRole="button" accessibilityLabel="Ir para cadastro" onPress={() => navigation.navigate('Signup')}>
								<Text style={{ color: '#3b82f6', fontSize: 16, padding: 8 }}>Cadastrar</Text>
							</Pressable>
						)
					})}
				/>
			) : (
				<>
					<Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
					<Stack.Screen
						name="Details"
						component={MovieDetailsScreen}
						options={({ route }) => ({ title: route.params.title })}
					/>
				</>
			)}
			<Stack.Screen
				name="Signup"
				component={SignupScreen}
				options={{ title: 'Cadastro' }}
			/>
		</Stack.Navigator>
	);
}


