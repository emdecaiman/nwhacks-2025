import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface ChatBubbleProps {
    message: string;
    pressable?: boolean;
    onPress?: () => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, pressable = false, onPress }) => {
    return (
        <Pressable onPress={pressable ? onPress : undefined} style={styles.container}>
            <View style={styles.bubble}>
                <Text style={styles.bubbleText}>{message}</Text>
                <View style={styles.arrowContainer}>
                    <View style={styles.arrow} />
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 170,
        left: -60,
    },
    bubble: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        position: 'relative',
    },
    bubbleText: {
        color: 'black',
        fontSize: 14,
    },
    arrowContainer: {
        position: 'absolute',
        bottom: -10,
        right: 10,
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: 'white',
    },
    arrow: {
        position: 'absolute',
        bottom: -1,
        left: -10,
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#ccc',
    },
});

export default ChatBubble;