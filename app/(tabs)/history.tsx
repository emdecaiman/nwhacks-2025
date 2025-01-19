import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button, FlatList, SafeAreaView } from 'react-native';
import { supabase } from '../../lib/supabase';
import InfoModal from '../../components/InfoModal';

interface StudySession {
    user_id: string;
    start_time: string;
    end_time: string;
    total_time: string;
}

interface ChatLog {
    user_id: string;
    date_created: string;
    chat_log: any; 
}

interface GroupedHistory {
    date: string;
    studySessions: StudySession[];
    chatLogs: ChatLog[];
}

export default function HistoryScreen() {
    const [groupedHistory, setGroupedHistory] = useState<GroupedHistory[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'session' | 'chat'>('session');
    const [modalData, setModalData] = useState<StudySession[] | ChatLog[]>([]);

    useEffect(() => {
        async function fetchHistory() {
            const { data: sessionData, error: sessionError } = await supabase
                .from('study_sessions')
                .select('user_id, start_time, end_time, total_time')
                .order('start_time', { ascending: false });

            if (sessionError) {
                console.error(sessionError);
                return;
            }

            const { data: chatData, error: chatError } = await supabase
                .from('chat_history')
                .select('user_id, date_created, chat_log')
                .order('date_created', { ascending: false });

            if (chatError) {
                console.error(chatError);
                return;
            }

            const groupedData: { [key: string]: GroupedHistory } = {};

            sessionData.forEach((session: StudySession) => {
                const date = new Date(session.start_time).toLocaleDateString();
                if (!groupedData[date]) {
                    groupedData[date] = { date, studySessions: [], chatLogs: [] };
                }
                
                groupedData[date].studySessions.push(session);
            });

            chatData.forEach((chat: ChatLog) => {
                const date = new Date(chat.date_created).toLocaleDateString();
                if (!groupedData[date]) {
                    groupedData[date] = { date, studySessions: [], chatLogs: [] };
                }
                groupedData[date].chatLogs.push(chat);
            });

            setGroupedHistory(Object.values(groupedData));
        }

        fetchHistory();
    }, []);

    const renderHistoryItem = ({ item }: { item: GroupedHistory }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Date: {item.date}</Text>
            <Button title="View Session Info" onPress={() => openModal('session', item.studySessions)} />
            <Button title="View Chat Logs" onPress={() => openModal('chat', item.chatLogs)} />
        </View>
    );

    const openModal = (type: 'session' | 'chat', data: StudySession[] | ChatLog[]) => {
        setModalType(type);
        setModalData(data);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setModalData([]);
    };

    return (
        <SafeAreaView style={styles.container}>
            {groupedHistory.length === 0 ? (
                <Text style={styles.noHistoryText}>No history yet!</Text>
            ) : (
                <FlatList
                    data={groupedHistory}
                    renderItem={renderHistoryItem}
                    keyExtractor={(item) => item.date}
                />
            )}
            <InfoModal
                visible={modalVisible}
                onClose={closeModal}
                type={modalType}
                data={modalData}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        padding: 20,
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
        color: '#fff',
        marginBottom: 5,
    },
    noHistoryText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
});