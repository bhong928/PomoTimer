import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState, useEffect } from "react";

const WorkTime = 25 * 60; //25min in seconds
const BreakTime = 5 * 60; //5min in seconds


export default function PomoTime() {
  const [seconds, setSeconds] = useState(WorkTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | number | undefined;
    clearInterval(timer);

    if (isRunning && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds == 0) {
      clearInterval(timer);
      setIsRunning(false);
      alert("Time to take a break.");
      setSeconds(isBreak ? WorkTime : BreakTime);
      setIsBreak(!isBreak);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, seconds]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(WorkTime);
    setIsBreak(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isBreak ? "Break Time" : "Work Time"}
      </Text>
      <Text style={styles.timer}>
        {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2,"0")}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={isRunning ? pauseTimer : startTimer}>
          <Text style={styles.buttonText}>{isRunning ? "Pause" : "Start"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={resetTimer}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#282c34",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  timer: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    backgroundColor: "#61dafb",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    color: "#000",
    fontWeight: "bold",
  },
});