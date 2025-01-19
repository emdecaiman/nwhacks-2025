import { Text, View, StyleSheet, Image } from "react-native";
import Button from "@/components/Button";
import Timer from "@/components/Timer";
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
    const [isEnabled, setIsEnabled] = useState<Boolean>(false);
    const studyInterval = 0.1; // or 50
    const breakInterval = 0.1; // or 10
    const numIntervals = 2;
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
        }, 5000);

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
            <Timer isEnabled={isEnabled} studyInterval={studyInterval} breakInterval={breakInterval} numIntervals={numIntervals} />
            <Button label={isEnabled ? "Pause" : "Start"} onPress={() => setIsEnabled(!isEnabled)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25292e",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
    },
    text: {
        color: "#fff",
    },
    botContainer: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
      },
      botImage: {
        width: 350,
        height: 350,
      },
      botText: {
        color: 'white',
        fontSize: 16,
        marginBottom: 10,
      },
});