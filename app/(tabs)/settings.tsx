import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert, Modal, TextInput } from 'react-native';
import { supabase } from '../../lib/supabase';
import Button from '@/components/Button';

// function to handle signing out
async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert(error.message);
}

export default function SettingScreen({ onUpdateSettings }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [breakTime, setBreakTime] = useState<number>(0);
    const [studyTime, setStudyTime] = useState<number>(0);
    const [numIntervals, setNumIntervals] = useState<number>(0);
    const [totalTime, setTotalTime] = useState<number>(0);

    const setPresetInterval = (studyTime: number, breakTime: number) => {
        setStudyTime(studyTime);
        setBreakTime(breakTime);
    };

    useEffect(() => {
        const total = numIntervals * (studyTime + breakTime);
        setTotalTime(total);
    }, [numIntervals, studyTime, breakTime]);

    const handleSave = async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            alert(error.message);
            return;
        }

        const userId = data.user?.id;
        if (!userId) {
            alert('User ID not found');
            return;
        }

        console.log(userId);
        console.log('update db: ' + JSON.stringify({ studyTime, breakTime, numIntervals }));

        const { error: updateError } = await supabase
            .from('user_settings')
            .update({ study_time: studyTime, break_time: breakTime, num_intervals: numIntervals })
            .eq('user_id', userId);

        setModalVisible(false);

        if (updateError) {
            alert(updateError.message);
        } else {
            alert('Session settings saved successfully');
            onUpdateSettings({ studyTime, breakTime, numIntervals });
        }
    };

    return (
        <View style={styles.container}>
            <Button label="Modify Intervals" onPress={() => setModalVisible(true)} />
            <Button label="Sign Out" onPress={() => signOut()} />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.inputRow}>
                            <Text style={styles.label}>Number of Intervals:</Text>
                            <TextInput
                                style={styles.input}
                                value={numIntervals.toString()}
                                onChangeText={(text) => setNumIntervals(Number(text))}
                                keyboardType="numeric"
                                placeholderTextColor="#fff"
                            />
                        </View>
                        <View style={styles.inputRow}>
                            <Text style={styles.label}>Intervals:</Text>
                            <View style={styles.intervalContainer}>
                                <Button 
                                    label="50/10" 
                                    onPress={() => setPresetInterval(50, 10)} 
                                /> 
                                <Button 
                                    label="25/5" 
                                    onPress={() => setPresetInterval(25, 5)} 
                                />
                            </View>
                        </View>
                        <View style={styles.inputRow}>
                            <Text style={styles.label}>Total Time:</Text>
                            <Text style={styles.totalTime}>{totalTime} minutes</Text>
                        </View>
                        <View style={styles.buttonRow}>
                            <Button label="Save" onPress={handleSave} />
                            <Button label="Cancel" onPress={() => setModalVisible(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 50,
        gap: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#1c1c1e', // Darker gray background color
        alignItems: 'flex-start', // Left-justify content
        justifyContent: 'center',
        padding: 30,
        width: '100%', // Make modal content full width
        gap: 40, // Evenly space rows
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        gap: 20,
    },
    label: {
        color: '#fff',
        fontSize: 16,
        flex: 1, // Allow label to take up available space
    },
    input: {
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 8,
        color: '#fff',
        flex: 2, // Allow input to take up available space
    },
    intervalContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        gap: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%', // Make button row full width
        gap: 20, // Evenly space buttons
    },
    totalTime: {
        color: '#fff',
        fontSize: 16,
    },
    text: {
        color: '#fff',
    },
});