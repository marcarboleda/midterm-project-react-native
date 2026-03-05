import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { JobFinderScreen } from '../screens/JobFinderScreen';
import { SavedJobsScreen } from '../screens/SavedJobsScreen';
import { ApplyScreen } from '../screens/ApplyScreen';
import { JobDetailsScreen } from '../screens/JobDetailsScreen'; // Import this
import { Ionicons } from '@expo/vector-icons';
import { useJobs } from '../context/JobContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="JobFinderHome" component={JobFinderScreen} />
    <Stack.Screen name="ApplyScreen" component={ApplyScreen} />
  </Stack.Navigator>
);

const SavedStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SavedJobsHome" component={SavedJobsScreen} />
    <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
    <Stack.Screen name="ApplyScreen" component={ApplyScreen} />
  </Stack.Navigator>
);

export const TabNavigator = () => {
  const { isDarkMode } = useJobs();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any = route.name === 'Home' ? 'home-outline' : 'bookmark-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: ((route) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? '';
          if (routeName === 'ApplyScreen' || routeName === 'ApplicationForm' || routeName === 'JobDetails') {
            return { display: 'none' };
          }
          return {
            backgroundColor: isDarkMode ? '#161B22' : '#FFFFFF',
            borderTopColor: isDarkMode ? '#30363D' : '#E1E4E8',
            height: 60,
            paddingBottom: 8,
          };
        })(route),
        tabBarActiveTintColor: '#0A66C2',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Saved" component={SavedStack} />
    </Tab.Navigator>
  );
};