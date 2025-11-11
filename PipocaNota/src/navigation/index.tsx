import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useAuth} from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import MyMoviesScreen from '../screens/MyMoviesScreen';

export type AuthStackParamList = {
	Login: undefined;
	Register: undefined;
};

export type AppStackParamList = {
	Tabs: undefined;
	MovieDetails: { movieId: number; title: string };
};

export type TabsParamList = {
	Search: undefined;
	MyMovies: undefined;
	Profile: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();
const Tabs = createBottomTabNavigator<TabsParamList>();

function TabsNavigator() {
	return (
		<Tabs.Navigator screenOptions={{headerShown: false}}>
			<Tabs.Screen
				name="Search"
				component={SearchScreen}
				options={{tabBarLabel: 'Buscar'}}
			/>
			<Tabs.Screen
				name="MyMovies"
				component={MyMoviesScreen}
				options={{tabBarLabel: 'Assistidos'}}
			/>
			<Tabs.Screen
				name="Profile"
				component={ProfileScreen}
				options={{tabBarLabel: 'Perfil'}}
			/>
		</Tabs.Navigator>
	);
}

function AppNavigator() {
	return (
		<AppStack.Navigator>
			<AppStack.Screen
				name="Tabs"
				component={TabsNavigator}
				options={{headerShown: false}}
			/>
			<AppStack.Screen
				name="MovieDetails"
				component={MovieDetailsScreen}
				options={({route}) => ({
					title: route.params.title,
				})}
			/>
		</AppStack.Navigator>
	);
}

export default function RootNavigator() {
	const {currentUser} = useAuth();

	if (!currentUser) {
		return (
			<AuthStack.Navigator>
				<AuthStack.Screen
					name="Login"
					component={LoginScreen}
					options={{title: 'Entrar'}}
				/>
				<AuthStack.Screen
					name="Register"
					component={RegisterScreen}
					options={{title: 'Cadastrar'}}
				/>
			</AuthStack.Navigator>
		);
	}

	return <AppNavigator />;
}


