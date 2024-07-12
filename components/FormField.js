import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

import icons from '../constants/icons'

const FormField = ({title, value, placeholder, handleChangeText, otherStyles, ...props}) => {
  
  const  [showPassword, setShowPassword] = useState(false)
    return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-black font-pmedium">{title}</Text>
      <View className="border-2 border-grey-500 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row">
        <TextInput 
        className="flex-1 text-white font-psemibold text-base" 
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#FFFF00"
        onChangeText={handleChangeText}
        secureTextEntry={title === 'Password' && !showPassword}
        />
        {title === 'Password' && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Image source={!showPassword ? icons.eye : icons.eyehide} className='w-6 h-6' resizeMode='contain' />

            </TouchableOpacity>
        )}
     
      </View>
    </View>
  )
}

export default FormField