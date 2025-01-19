import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import CircularProgress from 'react-native-circular-progress-indicator';

type Props = {
    isEnabled: Boolean;
    studyInterval: number;
    breakInterval: number;
    numIntervals: number;
}

const Timer = ({ isEnabled, studyInterval, breakInterval, numIntervals }: Props) => {
    const [timerCount, setTimer] = useState<number>(studyInterval * 60);
    const [isStudyTime, setIsStudyTime] = useState<Boolean>(true);
    const [intervalComplete, setIntervalComplete] = useState<Boolean>(false);
    const [timeElapsed, setTimeElapsed] = useState<number>(0);
    const [intervalsLeft, setIntervalsLeft] = useState<number>(numIntervals);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isEnabled && intervalsLeft > 0) {
            interval = setInterval(() => {
                setTimer(lastTimerCount => {
                    if (lastTimerCount === 0) {
                        if (isStudyTime) {
                            setIsStudyTime(false);
                            return breakInterval * 60;
                        } else {
                            setIntervalsLeft(prev => prev - 1);
                            if (intervalsLeft - 1 === 0) {
                                setIntervalComplete(true);
                                return 0;
                            }
                            setIsStudyTime(true);
                            return studyInterval * 60;
                        }
                    } else {
                        return lastTimerCount - 1;
                    }
                });
            }, 1000); //each count lasts for a second
        }
        //cleanup the interval on complete
        return () => clearInterval(interval);
    }, [isEnabled, isStudyTime, intervalsLeft, intervalComplete, studyInterval, breakInterval]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isEnabled && !intervalComplete) {
            interval = setInterval(() => {
                setTimeElapsed(prevTimeCount => prevTimeCount + 1);
            }, 1000);
        }
        //cleanup the interval on complete
        return () => clearInterval(interval);
    }, [isEnabled, intervalComplete]);

    const formatTime = (count: number) => {
        const minutes = Math.floor(count / 60);
        const seconds = count % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.progressText}>{`Time Elapsed: ${formatTime(timeElapsed)}`}</Text>
            <Text style={styles.progressText}>{`Intervals Left: ${intervalsLeft}`}</Text>
            <View style={styles.progressContainer}>
                <CircularProgress
                    value={timerCount}
                    radius={120}
                    maxValue={isStudyTime ? studyInterval * 60 : breakInterval * 60}
                    activeStrokeWidth={15}
                    inActiveStrokeWidth={15}
                    duration={1000}
                    showProgressValue={false}
                    activeStrokeColor={isStudyTime ? "#4CBF72" : "#FFAD33"}
                />
                <View style={styles.progressTextContainer}>
                    <Text style={styles.progressText}>{formatTime(timerCount)}</Text>
                    <Text style={styles.progressText}>{isStudyTime ? "Study Time" : "Break Time"}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        gap: 15,
    },
    progressContainer: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
    },
    progressTextContainer: {
        position: "absolute",
        alignItems: "center",
    },
    progressText: {
        color: "white",
        fontSize: 24,
    },

});

export default Timer;

