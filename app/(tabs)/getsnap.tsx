import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import icons from '../../constants/icons';

const SnapGet = () => {
  const [token, setToken] = useState(null);
  const [snaps, setSnaps] = useState([]);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [duration, setDuration] = useState();

  const [ProfilePicture, setProfilePicture] = useState(null);
  

  const getToken = async () => {
    const token = await AsyncStorage.getItem('my-key');
    setToken(token);
    return token;
  }

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      fetch('https://snapchat.epidoc.eu/snap', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbnkuYnJlY2hhcmRAZXBpdGVjaC5ldSIsImlhdCI6MTcxODAxMDIyOH0.ZBjIG21eNQsFPEGSEcYLIi9O-EGJ-fDKwTT-UYc2rfQ',
          'Authorization': 'Bearer ' + token
        },
      })
        .then(async response => {
          const result = await response.json();
          const snapArray = [];

          for (let index = 0; index < result.data.length; index++) {

            const snapResponse = await fetch('https://snapchat.epidoc.eu/snap/' + result.data[index]._id, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbnkuYnJlY2hhcmRAZXBpdGVjaC5ldSIsImlhdCI6MTcxODAxMDIyOH0.ZBjIG21eNQsFPEGSEcYLIi9O-EGJ-fDKwTT-UYc2rfQ',
                'Authorization': 'Bearer ' + token
              },
            });
            const snapResult = await snapResponse.json();

            const userReponse = await fetch('https://snapchat.epidoc.eu/user/' + result.data[index].from, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbnkuYnJlY2hhcmRAZXBpdGVjaC5ldSIsImlhdCI6MTcxODAxMDIyOH0.ZBjIG21eNQsFPEGSEcYLIi9O-EGJ-fDKwTT-UYc2rfQ',
                'Authorization': 'Bearer ' + token
              },
            });
            const userResult = await userReponse.json();
            // console.log(result.data[index].from)
            //  console.log(userResult.data.username)
      
            if (userResult.data.profilePicture) {
              setProfilePicture(null)
            } else {
              setProfilePicture("../../assets/profile.png")
            }
       
            const SnapData = {
              _id: snapResult.data._id,
              date: snapResult.data.date,
              duration: snapResult.data.duration,
              from: snapResult.data.from,
              username: userResult.data.username,
              profilePicture: userResult.data.profilePicture,
              image: snapResult.data.image,
            }

            // console.log(snapResult.data)
            // console.log(SnapData)
            setDuration(snapResult.data.duration)
            // console.log(snapResult.data.duration * 1000)
            snapArray.push(SnapData);
          }
          setSnaps(snapArray);

        })
        .catch(error => {
          console.error(error);
        });
    };
    fetchData();
    const intervalId = setInterval(() => {
      getToken().then((token) => {
        fetchData();
      });
    }, 15000);

    return () => clearInterval(intervalId);


  }, []);



  const handlePress = async (index) => {
    setFullScreenImage(snaps[index]);

    // console.log(snaps[index]._id)


    await fetch('https://snapchat.epidoc.eu/snap/seen/' + snaps[index]._id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbnkuYnJlY2hhcmRAZXBpdGVjaC5ldSIsImlhdCI6MTcxODAxMDIyOH0.ZBjIG21eNQsFPEGSEcYLIi9O-EGJ-fDKwTT-UYc2rfQ',
        'Authorization': 'Bearer ' + token
      },

    })
      .then(async response => {
        const data = await response.json();
        console.log(data)
      })
      .catch(error => {
        console.error(error)
      });

    setTimeout(() => {
      setFullScreenImage(null);
    }, (duration * 1000));
  };
// console.log(ProfilePicture)
  return (
    <SafeAreaView style={styles.Container}>

      {fullScreenImage ? (

        <View style={styles.fullScreenContainer}>
          <View style={styles.cirlceProg}>
            <CountdownCircleTimer
              isPlaying
              duration={duration}
              colors={['#004777', '#F7B801', '#A30000', '#A30000']}
              colorsTime={[7, 5, 2, 0]}
              size={[50]}
            />

          </View>
          <Image
            source={{ uri: fullScreenImage.image }}

            style={styles.fullScreenImage}

          />
        </View>

      ) : (


        <ScrollView>
          {snaps.map((snap, index) => (
                            

            <View key={index} >

              <TouchableOpacity onPress={() => handlePress(index)} style={styles.snapContainer}>
                {snap.profilePicture ? (
                <Image source={{ uri: snap.profilePicture }} style={styles.profilPicture} />
                // <Text style={styles.snapTextLogo}>➡️</Text>
                  // <Text style={styles.snapTextLogo}>👤</Text>
                ) : (
                // <Image source={ProfilePicture} style={styles.profilPicture} />
                <Text style={styles.snapTextLogo}>👤</Text>
                )}
                <Text style={styles.snapTextLogo}>🟥</Text>
                <View>
                  <Text style={styles.snapText}>{index + 1} - {snap.username}</Text>
                  <Text style={styles.snapText}>{snap.date}</Text>
                </View>
              </TouchableOpacity>
            </View>



          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#FFFF00'
  },
  snapContainer: {
    margin: 20,
    padding: 5,
    alignItems: 'center',
    display: "flex",
    flexDirection: "row",
    borderBottomColor: 'grey',
    borderBottomWidth: 2, 
    backgroundColor: "#FFFF99",
  },

  snapText: {
    fontSize: 15,
    marginBottom: 10,
    paddingLeft: 5,
    paddingTop: 5,
  },
  snapTextLogo: {
    fontSize: 50,
  },
  profilPicture: {
    width: '18%',
    height: '100%',
    resizeMode: 'contain',
    // transform: [{ rotate: '-90deg' }]
  },
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'black',
  },
  fullScreenImage: {
    width: '180%',
    height: '100%',

    resizeMode: 'contain',
    //  transform: [{ rotate: '-90deg' }]
  },
  cirlceProg: {
    color: 'white',
    position: "relative",
    marginTop: 70,
    marginLeft: 330,
    // top: 5,
    // right: -140,
    // width: 5,
    // height: 2,
    //  transform: [{ rotate: '-90deg' }]
  }
});

export default SnapGet;