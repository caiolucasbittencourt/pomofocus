import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type TimerCircleProps = {
  timeRemaining: number;
  animatedProgress: Animated.Value;
  circleSize: number;
  strokeWidth: number;
  radius: number;
  circumference: number;
  formatTime: (time: number) => string;
};

export function TimerCircle({
  timeRemaining,
  animatedProgress,
  circleSize,
  strokeWidth,
  radius,
  circumference,
  formatTime,
}: TimerCircleProps) {
  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={styles.circleWrapper}>
      <Svg
        height={circleSize}
        width={circleSize}
        viewBox={`0 0 ${circleSize} ${circleSize}`}
      >
        <Circle
          stroke="rgba(255,255,255,0.2)"
          fill="transparent"
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          stroke="rgba(255,255,255,0.8)"
          fill="transparent"
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${circleSize / 2}, ${circleSize / 2})`}
        />
      </Svg>
      <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circleWrapper: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    aspectRatio: 1,
    marginBottom: 40,
  },
  timerText: {
    position: "absolute",
    fontSize: 60,
    fontWeight: "bold",
    color: "#fff",
  },
});
