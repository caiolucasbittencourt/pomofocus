// components/pomodoro/CycleDots.tsx

import React from "react";
import { StyleSheet, View } from "react-native";

type CycleDotsProps = {
  round: number;
  currentMode: "focus" | "shortBreak" | "longBreak";
};

export function CycleDots({ round, currentMode }: CycleDotsProps) {
  return (
    <View style={styles.dotsContainer}>
      {[1, 2, 3, 4].map((dotIndex) => {
        const isFilled = dotIndex < round && currentMode !== "focus";
        const isActive = dotIndex === round && currentMode === "focus";

        return (
          <View
            key={dotIndex}
            style={[
              styles.dot,
              isFilled && styles.dotFilled,
              isActive && styles.dotActive,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: "row",
    marginVertical: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginHorizontal: 7,
  },
  dotActive: {
    backgroundColor: "#fff",
    transform: [{ scale: 1.1 }],
  },
  dotFilled: {
    backgroundColor: "rgba(255,255,255,0.7)",
  },
});
