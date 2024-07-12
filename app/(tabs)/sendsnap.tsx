import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNPickerSelect from "react-native-picker-select";
import icons from '../../constants/icons';


export default function App() {
  const CameraRef = useRef<CameraView | null>(null);
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPicture] = useState(null);
  const [camera, setCamera] = useState(true);
  const [image, setImage] = useState(null);
  const [value, setValue] = useState("1");


  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const user = async () => {
    await AsyncStorage.setItem('my-duration', value);
    if (!image) {
      await AsyncStorage.setItem('my-photo', photo.base64);
    } else {
      await AsyncStorage.setItem('my-photo', image.base64);
    }
    router.replace("../(snap)/user")
  };
  
  const takePicture = async () => {
    if (CameraRef.current) {
    
      const options = { quality: 0.5, base64: true, exif: false };
      const photo = await CameraRef.current.takePictureAsync(options);
      setPicture(photo);
      setCamera(false);
      //  console.log(photo.base64)
      
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      setCamera(false);
      //  console.log(result.assets[0].base64)
    }
  };

  if (!camera && (photo || image)) {
    return (
      <SafeAreaView style={styles.container}>
        {/* <View style={styles.container}> */}
          {photo ? (
            <Image style={{ resizeMode: 'contain', height: 600, width: 400 }} source={{ uri: photo.uri }} />
          ) : (
            <Image style={{ resizeMode: 'contain', height: 600, width: 400 }} source={{ uri: image.uri }} />
          )}
          <TouchableOpacity style={styles.button} onPress={() => { setCamera(true); setPicture(null); setImage(null); }}>
            <Text style={styles.button}>Reprendre</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <CustomButton
              style={styles.button}
              title="Envoyer"
              handlePress={user}
              containerStyles="mt-7"
            />
 
          </TouchableOpacity>
          <RNPickerSelect
          placeholder={{}}
          onValueChange={(value) => setValue(value)}
    
          items={[
            { label: "1s", value: 1 },
            { label: "2s", value: 2 },
            { label: "3s", value: 3 },
            { label: "4s", value: 4 },
            { label: "5s", value: 5 },
            { label: "6s", value: 6 },
            { label: "7s", value: 7 },
            { label: "8s", value: 8 },
            { label: "9s", value: 9 },
            { label: "10s", value: 10 },
          ]} />
        {/* </View> */}
      </SafeAreaView>
    )
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={CameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Image source={icons.flip} style={styles.logo2}/> 
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Image source={icons.shoot} style={styles.logo}/> 
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Image source={icons.galerie} style={styles.logo2}/> 
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 50,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    color: "black",
    zIndex: 200,
  },
  logo2: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
    color: "transparent",
    zIndex: 200,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});