// Import React and necessary components from React Native and React Navigation
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import TabBar from './components/TabBar/TabBar';
import { AlarmProvider } from './context/Alarm/AlarmContext';
import HomeScreen from './screens/Home/Home';
import InSleep from './screens/InSleep/InSleep';
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
    <NavigationContainer>
      <AlarmProvider>
        <Stack.Navigator>
          {/* Dev */}
          {/* <Stack.Screen name='Dev' component={InSleep} options={{ headerShown: false }} /> */}

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
            component={InSleep}
            options={{
              headerShown: false,
              animation: 'slide_from_bottom',
            }}
          />
        </Stack.Navigator>
      </AlarmProvider>
    </NavigationContainer>
  );
}

export default App;
