import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';

const TabBar = ({ state, descriptors, navigation }) => {
  const getIcon = (routeName, focused) => {
    const backgroundColor = focused ? '#3bcfff' : '#557186';

    switch (routeName) {
      case 'Sleep':
        return <Ionicons name='moon' size={20} color={backgroundColor} />;

      case 'Settings':
        return <Ionicons name='settings' size={20} color={backgroundColor} />;

      default:
        return <Ionicons name='moon' size={20} color={backgroundColor} />;
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#242830',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          return (
            <Pressable
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                height: 50,
              }}
            >
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {getIcon(route.name, isFocused)}

                <Text
                  style={{
                    color: isFocused ? '#3bcfff' : '#557186',
                  }}
                >
                  {route.name}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default TabBar;
