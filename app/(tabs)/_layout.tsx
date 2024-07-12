import { View, Image } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import icons from '../../constants/icons';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { opacity } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';


const Stack = createNativeStackNavigator();

const TabsIcon = ({ icon, color, name, focused }) => {
  return (
    <View>
      <Image
        source={icon}
        resizeMode='contain'
        className="w-8 h-7"
      />
    </View>
  );
}

const TabsLayout = () => {

  return (

    <Tabs
      screenOptions={{
        tabBarStyle: {
          elevation: 0,
          shadowOpacity: 0,
          padding: 20,
          backgroundColor: "transparent",

          tabBarStyle: [
            {
              backgroundColor: "transparent",
              display: "flex"
            },
            null
          ]
        },
      }}>


      <Tabs.Screen
        name='getsnap'
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabsIcon
              icon={icons.home}
              color={color}
              name="Chat"
              focused={focused}
            />
          )
        }}
      />


      <Tabs.Screen
        name='sendsnap'
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabsIcon
              icon={icons.leftArrow}
              color={color}
              name="Snap"
              focused={focused}
            />
          )
        }}
      />
      <Tabs.Screen
        name='logout'
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabsIcon
              icon={icons.menu}
              color={color}
              name="Paramètre"
              focused={focused}
            />
          )
        }}
      />

    </Tabs>

  );
}

export default TabsLayout;