import { Text, View, StyleSheet, Image } from "react-native";
import Button from "@/components/Button";
import Timer from "@/components/Timer";
import { supabase } from '../../lib/supabase';
import { useEffect, useState } from "react";
import ChatBubble from "@/components/ChatBubble";

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

async function getActiveSession(userId: string) {
    const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId)
        .is('end_time', null)
        .single();

    if (error) {
        return null;
    }

    return data;
}

export default function Index() {
    const [isEnabled, setIsEnabled] = useState<Boolean>(false);
    const studyInterval = 0.1; // or 50
    const breakInterval = 0.1; // or 10
    const [name, setName] = useState<string | null>(null);
    const [image, setImage] = useState(require('../../assets/images/capy/capy-waving-nobg.png'));
    const [chatMessage, setChatMessage] = useState<string>('Hi!');
    const [startTime, setStartTime] = useState<Date | null>(null);

    useEffect(() => {
        async function fetchNameAndSession() {
          const { data, error } = await supabase.auth.getUser();
          if (error) {
            console.error(error);
            return;
          }
          const user = data.user;
          if (user) {
            const userName = await getName(user.id);
            if (userName) {
              setName(userName);
              setChatMessage(`Hi ${userName}!`);
            } else {
              console.error('User profile not found');
            }
    
            const activeSession = await getActiveSession(user.id);
            if (activeSession) {
              setIsEnabled(true);
              setStartTime(new Date(activeSession.start_time));
              setImage(require('../../assets/images/capy/capy-laptop-nobg.png'));
            }
          } else {
            console.error('User not found');
          }
        }
    
        fetchNameAndSession();
    
        const timer = setTimeout(() => {
          setImage(require('../../assets/images/capy/capy-sitting-nobg.png'));
          setChatMessage('Begin your study session whenever you are ready!');
        }, 4000);
    
        return () => clearTimeout(timer);
      }, []);

    const handleToggle = async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) {
        console.error('User not found');
        return;
        }
        const user = data.user;

        if (!isEnabled) {
            const start = new Date();
            setStartTime(start);
            const { error: insertError } = await supabase
                .from('study_sessions')
                .insert([{ user_id: user.id, start_time: start }]);
            if (insertError) {
                console.error(insertError.message);
            } else {
                setImage(require('../../assets/images/capy/capy-laptop-nobg.png'));
            }
        } else {
            // End session
            const end = new Date();
            if (startTime) {
                const totalTime = end.getTime() - startTime.getTime();
                const { error: updateError } = await supabase
                  .from('study_sessions')
                  .update({ end_time: end, total_time: totalTime })
                  .eq('user_id', user.id)
                  .eq('start_time', startTime.toISOString())
                  .single();
                if (updateError) {
                  console.error(updateError.message);
                } else {
                  setImage(require('../../assets/images/capy/capy-sitting-nobg.png'));
                }
            }
            setStartTime(null);
        }

        setIsEnabled(!isEnabled);
    };

    return (
        <View style={styles.container}>
            <View style={styles.timerContainer}>
                <Timer isEnabled={isEnabled} studyInterval={studyInterval} breakInterval={breakInterval} />
                <Button label={isEnabled ? "Pause" : "Start"} onPress={handleToggle} />
            </View>
            <View style={styles.botContainer}>
                <Image source={image} style={styles.botImage} />
                {name && <ChatBubble message={chatMessage} />}
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25292e",
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
      },
      text: {
        color: 'white',
        fontSize: 18,
        marginBottom: 20,
      },
      timerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      botContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        alignItems: 'center',
      },
      botImage: {
        width: 150,
        height: 150,
      },
      botText: {
        color: 'white',
        fontSize: 16,
        marginTop: 10,
      },
});