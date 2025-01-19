import React, { useState } from 'react';
import { Modal, View, TextInput, Button, StyleSheet, Text, Image, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { supabase } from '../lib/supabase';

interface ChatBoxProps {
    visible: boolean;
    onClose: () => void;
    userName: string;
}

interface Message {
    sender: string;
    content: string;
}


const ChatBox: React.FC<ChatBoxProps> = ({ visible, onClose, userName }) => {
    const [question, setQuestion] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [conversation, setConversation] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleAskQuestion = async () => {
        setLoading(true);
        if (!question.trim()) return;

        const userMessage: Message = { sender: userName, content: question };
        setConversation([...conversation, userMessage]);
        setQuestion('');
        setLoading(true);
        try {
            // Make an API call to OpenAI directly
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': '',
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: question }],
                    max_tokens: 150,
                }),
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                console.error('Error details:', errorDetails);
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('API Response:', data);
            if (data.choices && data.choices.length > 0) {
                const aiMessage: Message = { sender: 'CapyBot', content: data.choices[0].message.content.trim() };
                setConversation([...conversation, userMessage, aiMessage]);
            } else {
                throw new Error('No choices found in response');
            }
        } catch (error) {
            console.error('Error fetching answer:', error);
            const errorMessage: Message = { sender: 'CapyBot', content: 'Sorry, something went wrong. Please try again.' };
            setConversation([...conversation, userMessage, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveChatLog = async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) {
            console.error('User not found');
            return;
        }
        const user = data.user;

        const { error: insertError } = await supabase
            .from('chat_history')
            .insert([{ user_id: user.id, chat_log: conversation }]);
        if (insertError) {
            console.error(insertError.message);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalContainer}>
                    <View style={styles.chatBox}>
                        <Image source={require('../assets/images/capy/capy-waving-nobg.png')} style={styles.capyImage} />
                        <Text style={styles.title}>Ask me anything!</Text>
                        <ScrollView style={styles.conversation}>
                            {conversation.map((msg, index) => (
                                <View key={index} style={styles.messageContainer}>
                                    <Text style={styles.sender}>{msg.sender}:</Text>
                                    <Text style={styles.message}>{msg.content}</Text>
                                </View>
                            ))}
                        </ScrollView>
                        <TextInput
                            style={styles.input}
                            placeholder="Type your question here..."
                            value={question}
                            onChangeText={setQuestion}
                        />
                        <Button title="Ask" onPress={handleAskQuestion} disabled={loading} />
                        <Button title="Save Chat Log" onPress={handleSaveChatLog} />
                        <Button title="Close" onPress={onClose} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    chatBox: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        gap: 20,
    },
    capyImage: {
        width: 50,
        height: 50,
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    conversation: {
        width: '100%',
        maxHeight: 200,
        marginBottom: 10,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    sender: {
        fontWeight: 'bold',
        marginRight: 5,
    },
    message: {
        flexShrink: 1,
    },
    input: {
        width: '100%',
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
    },
});

export default ChatBox;
