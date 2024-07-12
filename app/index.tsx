import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity, Animated, Easing } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link, router } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import logo from '../assets/icons/snapchat.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const rotateValue = useState(new Animated.Value(0))[0];

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync(Entypo.font);
        await new Promise(resolve => setTimeout(resolve, 2000));

        Animated.loop(
          Animated.timing(rotateValue, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ).start();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    const rotate = rotateValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'yellow' }} onLayout={onLayoutRootView}>
        <Animated.Image source={logo} style={[styles.LogoSplash, { transform: [{ rotate }] }]} />
      </View>
    );
  }

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('my-key');
      if (value !== null) {
        router.replace("/sendsnap");
      }
    } catch (e) {
    }
  };

  getData();

  return (
    <View style={styles.screenContainer}>
      <View style={styles.logoContainer}>
     
          <Image source={logo} style={styles.logo} /> 
 
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, styles.loginButton]}>
          <Link href='(auth)/sign-in' style={styles.link}>
            <Text style={styles.buttonText}>CONNEXION</Text>
          </Link>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.registerButton]}>
          <Link href='(auth)/sign-up' style={styles.link}>
            <Text style={styles.buttonText}>INSCRIPTION</Text>
          </Link>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = {
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "yellow",
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 600,
    resizeMode: 'contain',
    color: "black",
    zIndex: 200,
  },
  buttonsContainer: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    height: '20%',
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: "#f3435c",
  },
  registerButton: {
    backgroundColor: "#23affd",
  },
  link: {
    width: '100%',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  LogoSplash: {
    width: '60%',
    height: '20%',
  }
};