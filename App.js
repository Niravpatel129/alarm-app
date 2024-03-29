import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TabBar from './components/TabBar/TabBar';
import { AlarmProvider } from './context/Alarm/AlarmContext';
import { SoundProvider } from './context/sound/SoundContext';
import AlarmScreen from './screens/AlarmScreen/AlarmScreen';
import HomeScreen from './screens/Home/Home';
import HomeAlarm from './screens/HomeAlarm/HomeAlarm';
import OnboardingScreen from './screens/OnboardingScreen/OnboardingScreen';
import SettingsScreen from './screens/Settings/Settings';
import Toast from 'react-native-toast-message';
import PremiumScreen from './screens/PremiumScreen/PremiumScreen';

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <SoundProvider>
          <AlarmProvider>
            <Stack.Navigator>
              {/* Dev */}
              {/* <Stack.Screen name='Dev' component={Contract} options={{ headerShown: false }} /> */}
              <Stack.Screen
                name='Onboarding'
                component={OnboardingScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='Premium'
                component={PremiumScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name='Home'
                component={HomeAlarm}
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
        </SoundProvider>
      </NavigationContainer>
      <Toast />
    </GestureHandlerRootView>
  );
}

export default App;
