import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';

// function to handle signing outr
async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert(error.message);
}

export default function SettingScreen() {


    return (
        <View style={styles.container}>
            <Button title="Sign out" onPress={() => signOut()}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
    },
});
