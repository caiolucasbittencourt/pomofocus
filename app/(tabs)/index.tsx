import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CycleDots } from "../../components/pomodoro/CycleDots";
import { TimerCircle } from "../../components/pomodoro/TimerCircle";
import { TimerControls } from "../../components/pomodoro/TimerControls";

const initialTimes = { focus: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 };
type Mode = "focus" | "shortBreak" | "longBreak";

const modesConfig = {
  focus: { label: "Focus Time", time: initialTimes.focus },
  shortBreak: { label: "Short Break", time: initialTimes.shortBreak },
  longBreak: { label: "Long Break", time: initialTimes.longBreak },
};

const { width } = Dimensions.get("window");
const CIRCLE_SIZE = width * 0.7;
const STROKE_WIDTH = 10;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function PomodoroApp() {
  const [currentMode, setCurrentMode] = useState<Mode>("focus");
  const [timeRemaining, setTimeRemaining] = useState(modesConfig.focus.time);
  const [isActive, setIsActive] = useState(false);
  const [round, setRound] = useState(1);

  const intervalRef = useRef<number | null>(null);
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const animatedColor = useRef(new Animated.Value(0)).current;

  const toggleTimer = () => setIsActive((prev) => !prev);

  const changeMode = (newMode: Mode) => {
    setCurrentMode(newMode);
    setTimeRemaining(modesConfig[newMode].time);
    animatedProgress.setValue(0);
  };

  const skipToNext = () => {
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (currentMode === "focus") {
      const nextRound = round + 1;
      if (nextRound > 4) {
        changeMode("longBreak");
        setRound(1);
      } else {
        changeMode("shortBreak");
        setRound(nextRound);
      }
    } else {
      changeMode("focus");
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      Vibration.vibrate([500, 500]);
      setIsActive(false);
      skipToNext();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeRemaining]);

  useEffect(() => {
    const totalTime = modesConfig[currentMode].time;
    const progressValue =
      totalTime === 0 ? 0 : (totalTime - timeRemaining) / totalTime;
    Animated.timing(animatedProgress, {
      toValue: progressValue,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [timeRemaining, currentMode]);

  useEffect(() => {
    Animated.timing(animatedColor, {
      toValue: ["focus", "shortBreak", "longBreak"].indexOf(currentMode),
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [currentMode]);

  const backgroundColor = animatedColor.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ["#D95550", "#4C9195", "#437EA8"],
  });

  return (
    <Animated.View style={[styles.outerContainer, { backgroundColor }]}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <TimerCircle
            timeRemaining={timeRemaining}
            animatedProgress={animatedProgress}
            circleSize={CIRCLE_SIZE}
            strokeWidth={STROKE_WIDTH}
            radius={RADIUS}
            circumference={CIRCUMFERENCE}
            formatTime={formatTime}
          />
          <TimerControls
            isActive={isActive}
            onToggle={toggleTimer}
            onSkip={skipToNext}
          />
          <CycleDots round={round} currentMode={currentMode} />
          <Text style={styles.modeLabel}>{modesConfig[currentMode].label}</Text>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modeLabel: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "500",
  },
});
