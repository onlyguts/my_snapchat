import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import images from '../../constants/icons';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';




import AsyncStorage from '@react-native-async-storage/async-storage';

const snap = () => {
  const [id, setId] = useState(null);
  const [token, setToken] = useState(null);
  const [profils, setProfils] = useState();
  const [username, setUser] = useState("")

  const getToken = async () => {
    const token = await AsyncStorage.getItem('my-key');
    setToken(token);
    return token;
  }

  const getId = async () => {
    const id = await AsyncStorage.getItem('my-id');
    setId(id);
    return id;
  }


  const deconnexion = async () => {
    await AsyncStorage.removeItem('my-key');
    router.replace("/")
  };

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''

  })
  const profile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
      base64: true,
    });

    if (!result.canceled) {
      const token = await getToken();
  
      const userData = {
        profilePicture: 'data:image/png;base64,' + result.assets[0].base64 || null,
      };
  
      // console.log(profils)
  
      fetch('https://snapchat.epidoc.eu/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbnkuYnJlY2hhcmRAZXBpdGVjaC5ldSIsImlhdCI6MTcxODAxMDIyOH0.ZBjIG21eNQsFPEGSEcYLIi9O-EGJ-fDKwTT-UYc2rfQ',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(userData),
      })
        .then(data => {
          console.log("STATUS IMAGE " + data.status)
          if (data.status != 200){
          Alert.alert('ERROR 400', '', [
            { text: 'Ok', onPress: () => console.log("ok") },
          ]);}
        })
        .catch(error => {
          console.error(error)
        });
    };
    
  }
  const fetchUser = async () => {
    const token = await getToken();
    const id = await getId();
    // console.log(id)
    fetch('https://snapchat.epidoc.eu/user/' + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbnkuYnJlY2hhcmRAZXBpdGVjaC5ldSIsImlhdCI6MTcxODAxMDIyOH0.ZBjIG21eNQsFPEGSEcYLIi9O-EGJ-fDKwTT-UYc2rfQ',
        'Authorization': 'Bearer ' + token
      },
    })
      .then(async response => {
      const result = await response.json();
      setUser(result.username)
      })
    
      .catch(error => {
        console.error(error)
      });
  };

    // console.log(userResult.data.username)

    
  
  const submit = async () => {
    const token = await getToken();
  
    let userData = {
      email: form.email,
      username: form.username,
      password: form.password,
    };

    // console.log(profils)

    fetch('https://snapchat.epidoc.eu/user', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbnkuYnJlY2hhcmRAZXBpdGVjaC5ldSIsImlhdCI6MTcxODAxMDIyOH0.ZBjIG21eNQsFPEGSEcYLIi9O-EGJ-fDKwTT-UYc2rfQ',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(userData),
    })
      .then(data => {
        console.log("STATUS USER " + data.status)
        if (data.status != 200){
        Alert.alert('ERROR 400', '', [
          { text: 'Ok', onPress: () => console.log("ok") },
        ]);}
      })
      .catch(error => {
        console.error(error)
      });
  };

  const notdelete = async () => {
    return
  }
  const godelete = async () => {
    const token = await getToken();

    fetch('https://snapchat.epidoc.eu/user', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbnkuYnJlY2hhcmRAZXBpdGVjaC5ldSIsImlhdCI6MTcxODAxMDIyOH0.ZBjIG21eNQsFPEGSEcYLIi9O-EGJ-fDKwTT-UYc2rfQ',
        'Authorization': 'Bearer ' + token
      },
    })
      .then(data => {
        console.log(data)
        console.log(data.statusText)
        router.replace("/")
        deconnexion()
        // console.log(token)
      })
      .catch(error => {
        console.error(error)
      });
  }
  const deleted = async () => {
    Alert.alert('Voulez supprimer votre compte?', 'cela et ireversible !', [
      { text: 'OUI', onPress: () => godelete() },
      { text: 'NON', onPress: () => notdelete() },
    ]);


  };

  // fetchUser();




  return (
    <SafeAreaView className='bg-[#FFFF00] h-full'>
      {/* <Text>{username}</Text> */}
      <ScrollView>
        <View className="w-full justify-center min-h-[70vh] my-6 px-4">

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
            title="Photo de profile"
            handlePress={profile}
            color={"blue"}
            containerStyles="mt-7"
          />
          <CustomButton
            title="Modifier Profile"
            handlePress={submit}
            color={"#FFF"}
            containerStyles="mt-7"
          />
          <CustomButton
            title="Deconnexion"
            handlePress={deconnexion}
            color={"blue"}
            containerStyles="mt-7"
          />
          <CustomButton
            title="Supprimer compte"
            handlePress={deleted}
            color={"red"}
            containerStyles="mt-7"
          />

          {/* <CustomButton
          title="User"
          handlePress={user}
          containerStyles="mt-7"
        /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default snap