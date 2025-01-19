import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';

interface StudySession {
    user_id: string;
    start_time: string;
    end_time: string;
    total_time: string;
}

interface ChatLog {
    user_id: string;
    date_created: string;
    chat_log: any; // You can define a more specific type if you know the structure of the chat log
}

interface Message {
    sender: string;
    content: string;
}

interface InfoModalProps {
    visible: boolean;
    onClose: () => void;
    type: 'session' | 'chat';
    data: StudySession[] | ChatLog[];
}

// const parseIntervalToMilliseconds = (interval: string): number => {
//     const regex = /(\d+)\s*days?\s*(\d+):(\d+):(\d+)/;
//     const matches = interval.match(regex);

//     if (!matches) {
//         return 0;
//     }

//     const days = parseInt(matches[1], 10);
//     const hours = parseInt(matches[2], 10);
//     const minutes = parseInt(matches[3], 10);
//     const seconds = parseInt(matches[4], 10);

//     return (((days * 24 + hours) * 60 + minutes) * 60 + seconds) * 1000;
// };

const InfoModal: React.FC<InfoModalProps> = ({ visible, onClose, type, data }) => {
    const renderSessionItem = ({ item }: { item: StudySession }) => {
        const startTime = new Date(item.start_time);
        const endTime = new Date(item.end_time);
        //const totalMilliseconds = parseIntervalToMilliseconds(item.total_time);
        return (
            <View style={styles.itemContainer}>
                <Text style={styles.itemText}>Start Time: {startTime.toLocaleTimeString()}</Text>
                <Text style={styles.itemText}>End Time: {endTime.toLocaleTimeString()}</Text>
                {/*<Text style={styles.itemText}>Total Time: {(totalMilliseconds / 60000).toFixed(2)} minute</Text>*/}
            </View>
        );
    };

    const renderChatItem = ({ item }: { item: ChatLog }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Date: {new Date(item.date_created).toLocaleTimeString()}</Text>
            <ScrollView style={styles.conversation}>
                {item.chat_log.map((msg: Message, index: number) => (
                    <View key={index} style={styles.messageContainer}>
                        <Text style={styles.sender}>{msg.sender}:</Text>
                        <Text style={styles.message}>{msg.content}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );

    //const totalStudyTime = (data as StudySession[]).reduce((total, session) => total + parseIntervalToMilliseconds(session.total_time), 0);

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Text style={styles.closeButtonText}>X</Text>
                            </TouchableOpacity>
                            <Text style={styles.title}>{type === 'session' ? 'Session Info' : 'Chat Logs'}</Text>
                            {type === 'session' ? (
                                <>
                                    <FlatList
                                        data={data as StudySession[]}
                                        renderItem={renderSessionItem}
                                        keyExtractor={(item) => (item as StudySession).start_time}
                                    />
                                    {/*<Text style={styles.totalText}>
                                        Total Study Time: {(totalStudyTime / 60000).toFixed(2)} minutes
                                    </Text>*/}
                                </>
                            ) : (
                                <FlatList
                                    data={data as ChatLog[]}
                                    renderItem={renderChatItem}
                                    keyExtractor={(item) => (item as ChatLog).date_created}
                                />
                            )}
                        </View>
                    </TouchableWithoutFeedback>
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
        color: 'white',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#25292e',
        padding: 20,
        borderRadius: 10,
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        marginBottom: 20,
    },
    itemContainer: {
        backgroundColor: '#333',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    itemText: {
        color: 'white',
        marginBottom: 5,
    },
    totalText: {
        color: 'white',
        fontSize: 18,
        marginTop: 20,
        textAlign: 'center',
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
});

export default InfoModal;