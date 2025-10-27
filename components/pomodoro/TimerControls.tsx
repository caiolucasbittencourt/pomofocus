import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

type TimerControlsProps = {
  isActive: boolean;
  onToggle: () => void;
  onSkip: () => void;
};

export function TimerControls({
  isActive,
  onToggle,
  onSkip,
}: TimerControlsProps) {
  return (
    <View style={styles.controlsContainer}>
      <Pressable onPress={onSkip} style={styles.controlButton}>
        <FontAwesome5 name="step-backward" size={28} color="#fff" />
      </Pressable>
      <Pressable onPress={onToggle} style={styles.playPauseButton}>
        <FontAwesome5
          name={isActive ? "pause-circle" : "play-circle"}
          size={70}
          color="#fff"
        />
      </Pressable>
      <Pressable onPress={onSkip} style={styles.controlButton}>
        <FontAwesome5 name="step-forward" size={28} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
  },
  controlButton: {
    padding: 10,
    marginHorizontal: 15,
  },
  playPauseButton: {
    padding: 10,
  },
});
