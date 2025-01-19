import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ChatBubbleProps {
  message: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  return (
    <View style={styles.bubble}>
      <Text style={styles.bubbleText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    bottom: 170,
    left: -20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  bubbleText: {
    color: 'black',
    fontSize: 14,
  },
});

export default ChatBubble;