import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Button from '@/components/Button';

const Intervals = () => {
    const [breakTime, setBreakTime] = useState<number>(0);
    const [studyTime, setStudyTime] = useState<number>(0);
    const [numIntervals, setNumIntervals] = useState<number>(0);

    const setPresetInterval = (studyTime: number, breakTime: number) => {
        setStudyTime(studyTime);
        setBreakTime(breakTime);
    };

    const handleStartSession = () => {
        // Handle session start logic here
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Number of Intervals:</Text>
            <TextInput
                style={styles.input}
                value={numIntervals}
                onChangeText={(text) => setNumIntervals(Number(text))}
                keyboardType="numeric"
                placeholderTextColor="#fff"
            />
            <Text style={styles.label}>Intervals:</Text>
            <View style={styles.intervalContainer}>
                <Button label="50/10" onPress={() => setPresetInterval(50, 10)} /> 
                <Button label="25/5" onPress={() => setPresetInterval(25, 5)} />
            </View>
            <Button label="Save" onPress={handleStartSession} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: "#25292e",
        gap: 20,
    },
    label: {
        fontSize: 18,
        color: '#fff',
    },
    input: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 8,
        color: '#fff',
        width: 250,
    },
    intervalContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 20,
        margin: 10,
    },
    buttonStyle: {
        justifyContent: "center",
    }
});

export default Intervals;
