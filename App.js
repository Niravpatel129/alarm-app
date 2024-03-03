// Import React and necessary components from React Native and React Navigation
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TabBar from './components/TabBar/TabBar';
import { AlarmProvider } from './context/Alarm/AlarmContext';
import AlarmScreen from './screens/AlarmScreen/AlarmScreen';
import HomeScreen from './screens/Home/Home';
import OnboardingScreen from './screens/OnboardingScreen/OnboardingScreen';
import SettingsScreen from './screens/Settings/Settings';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
      <Tab.Screen
        name='Sleep'
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />

      <Tab.Screen name='Settings' component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AlarmProvider>
          <Stack.Navigator>
            {/* Dev */}
            {/* <Stack.Screen name='Dev' component={AlarmScreen} options={{ headerShown: false }} /> */}
            <Stack.Screen
              name='Onboarding'
              component={OnboardingScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name='Home'
              component={MyTabs}
              options={{
                headerShown: false,
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name='AlarmScreen'
              component={AlarmScreen}
              options={{
                headerShown: false,
                animation: 'slide_from_bottom',
              }}
            />
          </Stack.Navigator>
        </AlarmProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
