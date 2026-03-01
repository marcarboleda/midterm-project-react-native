import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { JobProvider } from './src/context/JobContext';
import { TabNavigator } from './src/navigation/TabNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <JobProvider>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </JobProvider>
    </SafeAreaProvider>
  );
}