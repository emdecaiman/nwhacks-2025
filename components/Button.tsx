import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

type Props = {
  label: string;
  onPress: () => void;
};

export default function Button({ label, onPress }: Props) {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 100,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF",
  },
  button: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
  }
});

