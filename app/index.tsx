import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { Audio } from "expo-av"; // Import Audio API

export default function PomoTime() {
  // Work Time & Break Time
  const [workTime, setWorkTime] = useState(25 * 60); //Default 25m Work Time
  const [breakTime, setBreakTime] = useState(5 * 60); //Default 5m Break Time
  const [seconds, setSeconds] = useState(workTime); //Timer Countdown
  const [isRunning, setIsRunning] = useState(false); //Clock Boolean
  const [isBreak, setIsBreak] = useState(false); //Break Boolean
  const [sound, setSound] = useState<Audio.Sound | null > (null); // Lofi Music Sound

  const changeWorkTime = (newTime: number)=>{
    setWorkTime(newTime);
    setSeconds(newTime);
    setIsRunning(false);
    setIsBreak(false);
  };

  const changeBreakTime = (newTime: number)=>{
    setBreakTime(newTime);
    if (isBreak){
      setSeconds(newTime);
      setIsRunning(false);
    }
  }

  // Function to Play Lofi Music
  async function playMusic() {
    if (sound) return; 

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" }, // Replace with lofi music URL
      { shouldPlay: true, isLooping: true } // Auto-play and loop
    );
    setSound(newSound);
    await newSound.playAsync();
  }

  // Function to Stop Music
  async function stopMusic() {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  }

  // Timer Logic
  useEffect(() => {
    let timer: NodeJS.Timeout | number | undefined;

    if (isRunning) {
      if (!isBreak) {
        playMusic(); // Only play music when work session starts
      }

      if (seconds > 0) {
        timer = setInterval(() => {
          setSeconds((prev) => prev - 1);
        }, 1000);
      } else {
        clearInterval(timer);
        setIsRunning(false);
        stopMusic(); // Stop music when switching to break
        alert("Time to take a break.");
        setSeconds(isBreak ? workTime : breakTime);
        setIsBreak(!isBreak);
      }
    } else {
      stopMusic(); // Stop music if paused
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, seconds]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(workTime);
    setIsBreak(false);
    stopMusic();
  };

  //Settings
  const [showSettings, setShowSetings] = useState(false);

  return (
    <View style={styles.container}>

      {/* Shuffle Button for Settings */}
      <TouchableOpacity style={styles.shuffleButton} onPress={()=> setShowSetings(!showSettings)}>
        <Icon name="random" size={30} color="white"/>
      </TouchableOpacity>

      {/* Settings Conditional Statement Wrap */}
      {showSettings && (
        <View style={styles.settingsContainer}> 
        {/* Change Work Time Button */}
        <View style={styles.workContainer}>
          <TouchableOpacity style={styles.workTimeButton} onPress={()=> changeWorkTime( 0.1 * 60 )}>
            <Text style={styles.workTimeText}>0.06 min</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.workTimeButton} onPress={()=> changeWorkTime( 25 * 60 )}>
            <Text style={styles.workTimeText}>25 min</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.workTimeButton} onPress={()=> changeWorkTime( 45 * 60 )}>
            <Text style={styles.workTimeText}>45 min</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.workTimeButton} onPress={()=> changeWorkTime( 60 * 60 )}>
            <Text style={styles.workTimeText}>60 min</Text>
          </TouchableOpacity>
        </View>

        {/* Change Break Time */}
        <View style={styles.breakContainer}>
          <TouchableOpacity style={styles.breakTimeButton} onPress={()=> changeBreakTime ( 5 * 60 )}>
            <Text style={styles.breakTimeText}>5 min</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.breakTimeButton} onPress={()=> changeBreakTime ( 10 * 60 )}>
            <Text style={styles.breakTimeText}>10 min</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.breakTimeButton} onPress={()=> changeBreakTime( 15 * 60 )}>
            <Text style={styles.breakTimeText}>15 min</Text>
          </TouchableOpacity>
        </View>
      </View>
      )}

      {/* Work or Break Title Display */}
      <Text style={styles.title}>
        {isBreak ? "Break Time" : "Work Time"}
      </Text>

      {/* Clock Display */}
      <Text style={styles.timer}> 
        {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2,"0")}
      </Text>

      {/* Start/Pause and Reset Timer Button */}
      <View style={styles.startStopContainer}>
        <TouchableOpacity style={styles.button} onPress={isRunning ? pauseTimer : startTimer}>
          <Icon name={isRunning ? "pause" : "play"} size={30} color="black"/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={resetTimer}>
          <Icon name="repeat" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  //Container
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#282c34",
  },
  //Shuffle Button
  shuffleButton: {
    position: "absolute",
    top: 20,
    left: 10,
    backgroundColor: "transparent",
    padding: 10,
  },
  //Settings Container
  settingsContainer: {
    position: "absolute",
    top: 10, // Aligns with shuffle button
    left: 80, // Aligns with shuffle button
    backgroundColor: "transparent",
    alignItems: "flex-start",
    padding: 5,
  },
  //Work Button Container
  workContainer: {
    flexDirection: "row",
    gap: 8,
    padding: 5,
  },
  workTimeButton: {
    backgroundColor: "green",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  workTimeText: {
    fontSize: 15,
    color: "black",
  },
  //Break Button Container
  breakContainer: {
    flexDirection: "row",
    gap: 20,
  },
  breakTimeButton: {
    backgroundColor: "grey",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  breakTimeText: {
    fontSize: 15,
    color: "black",
  },
  //Titles and Timer
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
  //Start Pause Container
  startStopContainer: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 30,
    borderRadius: 10,
  },  
});