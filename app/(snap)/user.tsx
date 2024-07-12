import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import CustomButton from '../../components/CustomButton';

import * as FileSystem from 'expo-file-system';
import { Link, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';


const User = () => {

    const [data, setData] = useState([]);
    const [token, setToken] = useState(null);
    const [checkedState, setCheckedState] = useState({});

    const getToken = async () => {
        const token = await AsyncStorage.getItem('my-key');
        setToken(token);
        return token;
    }

    useEffect(() => {
        const fetchData = async () => {
            const token = await getToken();
            fetch('https://snapchat.epidoc.eu/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbnkuYnJlY2hhcmRAZXBpdGVjaC5ldSIsImlhdCI6MTcxODAxMDIyOH0.ZBjIG21eNQsFPEGSEcYLIi9O-EGJ-fDKwTT-UYc2rfQ',
                    'Authorization': 'Bearer ' + token
                },
            })
                .then(async response => {
                    const result = await response.json();
                    // console.log(result.data)
                    setData(result.data);
                    const initialCheckedState = result.data.reduce((acc, user) => {
                        // console.log(acc[user._id])
                        acc[user._id] = false;
                        // console.log(acc[user._id])
                        return acc;
                    }, {});
                    setCheckedState(initialCheckedState);
                })
                .catch(error => {
                    console.error(error);
                });
        };

        fetchData();
    }, []);

    const handleCheckboxChange = (userId) => {
        // console.log(userId)
        setCheckedState(prevState => ({
            ...prevState,
            [userId]: !prevState[userId]
        }));
    };
    const back = async () => {
        router.replace('../(tabs)/sendsnap')
    }

    const sendtouser = async () => {
        const idUser = Object.keys(checkedState).filter(key => checkedState[key]);
        const token = await getToken();
        const photo = await AsyncStorage.getItem('my-photo');
        const duration = await AsyncStorage.getItem('my-duration');


        // const base64 = await FileSystem.readAsStringAsync(photo, { encoding: 'base64' });
        // console.log(photo)
        console.log(idUser.length)
        for (let index = 0; index < idUser.length; index++) {
            const snapData = {
                to: idUser[index],
                image: 'data:image/png;base64,' + photo,
                duration: parseInt(duration),
            };

            fetch('https://snapchat.epidoc.eu/snap', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbnkuYnJlY2hhcmRAZXBpdGVjaC5ldSIsImlhdCI6MTcxODAxMDIyOH0.ZBjIG21eNQsFPEGSEcYLIi9O-EGJ-fDKwTT-UYc2rfQ',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(snapData),
            })
                .then(async response => {
                    console.log(response.status)
                    const result = await response.json();
                    console.log(result)
                    console.log("snap good")
                    router.replace("../(tabs)/sendsnap")
                })
                .catch(error => {
                    console.error(error);
                });

        }


    };


    return (
        <View style={styles.container}>

            <SafeAreaView>
                <ScrollView >
                    <View style={styles.container}>
                        {data.map(user => (
                            <View style={styles.snap} key={user._id}>
                                <Checkbox
                                    style={styles.Checkbox}
                                    value={checkedState[user._id]}
                                    onValueChange={() => handleCheckboxChange(user._id)}
                                />
                                <Text style={{ margin: 8 }}>{user.username}</Text>

                            </View>
                        ))}

                    </View>

                </ScrollView>


            </SafeAreaView>
            <View style={styles.send}>

                <CustomButton

                    title="Retour"
                    color="white"
                    handlePress={back}
                    containerStyles="mt-7"
                />
                <CustomButton

                    title="Envoyer"
                    color="white"
                    handlePress={sendtouser}
                    containerStyles="mt-7"
                />

            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        marginBottom: 185,
        // backgroundColor: "#FFF"
    },
    snap: {
        flex: 1,
        flexDirection: 'row',
        margin: 5,
        padding: 5,
        // backgroundColor: "green",
        borderBottomColor: 'grey',
        borderBottomWidth: 2
    },
    Checkbox: {
        height: 30,
        width: 30,


    },

    send: {
        // position: 'relative',
        // right: '-45%',
        // top: '80%',
        // height: 50,
        display: "flex",
        flexDirection: "row",
        // backgroundColor: "#FFFF00",
        // margin: 10,
        // paddingBottom: -50,
        // backgroundColor: "red",
        // height: 0,
        gap: 245,
        paddingLeft: 20,
        margin: -5,
        width: 550,

    },


});

export default User;