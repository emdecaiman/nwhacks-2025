import React, { useState, useEffect } from 'react'
import { Alert, StyleSheet, View, AppState, TextInput, Image, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Appearance, useColorScheme } from 'react-native'
import { supabase } from '../lib/supabase'
import { Button, Input} from '@rneui/themed'
import { StatusBar } from 'expo-status-bar';

AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    async function signInWithEmail() {

        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) Alert.alert(error.message)
        setLoading(false)
    }

    async function signUpWithEmail() {
        if (!isSignUp) {
            setIsSignUp(true);
            return;
        }
        setLoading(true)
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            Alert.alert(error.message);
        } else if (data && data.user) {
            const user = data.user;
            // Update the user's profile with the full name
            const { error: updateError } = await supabase
                .from('profiles')
                .upsert({ id: user.id, full_name: fullName });

            if (updateError) {
                Alert.alert(updateError.message);
            } else {
                // Insert a new row into the user_settings table
                const { error: settingsError } = await supabase
                    .from('user_settings')
                    .insert({ user_id: user.id });

                if (settingsError) {
                    Alert.alert(settingsError.message);
                }
            }
        }
        setLoading(false)
    }

    return (
        <>
        <StatusBar style="auto" />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Text style={styles.title}>CapyStudy</Text>
                <Image
                    source={require('../assets/images/capy/capy-waving-nobg.png')}
                    style={styles.botImage}
                />
                <View style={[styles.verticallySpaced, styles.mt20]}>
                    <Input
                        label="Email"
                        leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        inputStyle={{ color: 'white' }}
                        placeholder="email@address.com"
                        autoCapitalize={'none'}
                    />
                </View>
                <View style={styles.verticallySpaced}>
                    <Input
                        label="Password"
                        leftIcon={{ type: 'font-awesome', name: 'lock' }}
                        onChangeText={(text) => setPassword(text)}
                        inputStyle={{ color: 'white' }}
                        value={password}
                        secureTextEntry={true}
                        placeholder="Password"
                        autoCapitalize={'none'}
                    />
                </View>
                {isSignUp && (
                    <View style={styles.verticallySpaced}>
                        <TextInput
                            placeholder="Full Name"
                            value={fullName}
                            onChangeText={(text) => setFullName(text)}
                            style={styles.input}
                        />
                    </View>
                )}
                <View style={[styles.verticallySpaced, styles.mt20]}>
                    <TouchableOpacity style={styles.button} onPress={() => signInWithEmail()} disabled={loading}>
                        <Text style={styles.buttonText}>Sign in</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.verticallySpaced, styles.mt20]}>
                    <TouchableOpacity style={styles.button} onPress={() => signUpWithEmail()} disabled={loading}>
                        <Text style={styles.buttonText}>Sign up</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </TouchableWithoutFeedback>

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 100,
        alignItems: 'center', // Center the content horizontally
        justifyContent: 'flex-start', // Align items at the top
        backgroundColor: "#25292e",
      },
      title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginTop: 40,
        color: 'white',
      },
      verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
      },
      input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        color: 'black',
        fontSize: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
      },
      botImage: {
        display: 'flex',
        alignSelf: 'center',
        width: 150,
        height: 150,
        marginTop: 20,
        marginBottom: 30,
        marginLeft: -20,
      },
      mt20: {
        marginTop: 10, // Add margin top to space out the elements
      },
      button: {
        backgroundColor: '#1e90ff',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
})