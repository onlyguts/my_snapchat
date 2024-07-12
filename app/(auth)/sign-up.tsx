import { View, Text, ScrollView, Image, Linking, Button, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'

const SignUp = () => {

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''

  })

  const [isSubmitting, setisSubmitting] = useState(false)

  const submit = async () => {

    if (!form.email || !form.password || !form.username) {
      Alert.alert('Création Erreur', 'Tu dois remplir les champs', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
      return 
    }

    const userData = {
      email: form.email,
      username: form.username,
      password: form.password,
    };
   
    fetch('https://snapchat.epidoc.eu/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbnkuYnJlY2hhcmRAZXBpdGVjaC5ldSIsImlhdCI6MTcxODAxMDIyOH0.ZBjIG21eNQsFPEGSEcYLIi9O-EGJ-fDKwTT-UYc2rfQ',
      },
      body: JSON.stringify(userData),
    })
      .then(data => {
        console.log(data)
        router.replace("/sign-in")
      })
      .catch(error => {
        Alert.alert('Création Erreur', 'l\'email / mot de passe est invalide', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
        console.error(error)
      });
  }

  return (
    <SafeAreaView className='bg-[#FFFF00] h-full'>
      <ScrollView>
        <View className="w-full justify-center min-h-[70vh] my-6 px-4">
          <Text className="text-2xl text-black text-semibold mt-10 font-psemibold">Log up to snapchat</Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-7"
          />
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
            title="Register"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
            href="/sign-in"
          />
          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className="text-lg text-black font-pregular">Have account?</Text>
            <Link href="/sign-in" className="text-lg font-psemibold text-secondary">Login</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp