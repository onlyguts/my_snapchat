import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import images from '../../constants/icons';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'

import AsyncStorage from '@react-native-async-storage/async-storage';

const SignIn = () => {

  const [form, setForm] = useState({
    email: '',
    password: ''

  })

  const [isSubmitting, setisSubmitting] = useState(false)

  const submit = async () => {
    
    if (!form.email || !form.password) {
      Alert.alert('Connexion Erreur', 'Tu dois remplir les champs', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
      return 
    }

    const userData = {
      email: form.email,
      password: form.password,
    };

    fetch('https://snapchat.epidoc.eu/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbnkuYnJlY2hhcmRAZXBpdGVjaC5ldSIsImlhdCI6MTcxODAxMDIyOH0.ZBjIG21eNQsFPEGSEcYLIi9O-EGJ-fDKwTT-UYc2rfQ'
      },
    
      body: JSON.stringify(userData),
    })
    .then(async response => {
      const data = await response.json();
      await AsyncStorage.setItem('my-key', data.data.token); 
      await AsyncStorage.setItem('my-id', data.data._id); 
      console.log(data.data.token)
      console.log(data.data._id)
      router.replace("/sendsnap")
    })

    .catch(error => {
      Alert.alert('Connexion Erreur', 'l\'email / mot de passe est invalide', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
      return
      console.error(error)
    });
  };

  return (
    <SafeAreaView className='bg-[#FFFF00] h-full'>
      <ScrollView>
        <View className="w-full justify-center min-h-[70vh] my-6 px-4">
          <Text className="text-2xl text-black text-semibold mt-10 font-psemibold">Log in to snapchat</Text>
          <FormField
            title="Email"
            value={form.email}

            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            keyboardType="password"
          />
          <CustomButton
            title="Login"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
  

          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className="text-lg text-black font-pregular">Don't have account?</Text>
            <Link href="/sign-up" className="text-lg font-psemibold text-secondary">Register</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn