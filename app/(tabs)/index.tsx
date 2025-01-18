import { Text, View, StyleSheet, Image } from "react-native";
import { supabase } from '../../lib/supabase';
import { useEffect, useState } from "react";

async function getName(userId: string) {
    const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single()

    if (error) {
        console.error(error);
        return null;
    }

    return data?.full_name;
}

export default function Index() {
    const [name, setName] = useState<string | null>(null);
    const [image, setImage] = useState(require('../../assets/images/capy/capy-waving-nobg.png'));
    const [text, setText] = useState('Hi!');

    useEffect(() => {
        async function fetchName() {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error(error);
                return;
            }
            if (user) {
                const userName = await getName(user.id);
                setName(userName);
            }
        }

        fetchName();

        const timer = setTimeout(() => {
            setImage(require('../../assets/images/capy/capy-sitting-nobg.png'));
            setText('Begin your study session whenever you are ready!');
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {name ? `Welcome, ${name}!` : 'Loading...'}
            </Text>
            <View style={styles.botContainer}>
                <Image source={image} style={styles.botImage} />
                <Text style={styles.botText}>{text}</Text>
            </View>
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
        fontSize: 18,
    },
    botContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    botImage: {
        width: 100,
        height: 100,
    },
    botText: {
        color: 'white',
        fontSize: 16,
        marginTop: 10,
    },
});