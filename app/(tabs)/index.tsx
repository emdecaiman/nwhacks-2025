import { Text, View, StyleSheet } from "react-native";
import Button from "@/components/Button";
import Timer from "@/components/Timer";
import { useState } from "react";

export default function Index() {
    const [isEnabled, setIsEnabled] = useState<Boolean>(false);
    const studyInterval = 0.1; // or 50
    const breakInterval = 0.1; // or 10

    return (
        <View style={styles.container}>
            <Timer isEnabled={isEnabled} studyInterval={studyInterval} breakInterval={breakInterval} />
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
});