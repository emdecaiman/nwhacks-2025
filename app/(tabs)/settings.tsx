import { Text, View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import Button from '@/components/Button';

// function to handle signing out
async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert(error.message);
}

export default function SettingScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Button label="Modify Intervals" onPress={() => router.push('/intervals')} />
            <Button label="Sign Out" onPress={() => signOut()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        gap: 20,
    },
    label: {
        color: '#fff',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    text: {
        color: '#fff',
    },
});
