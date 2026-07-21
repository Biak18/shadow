import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { border, colors, radius, spacing } from "@/theme/theme";

export function SkeletonCard() {
  const pulse = useSharedValue(0.4);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 700 }),
      -1, // infinite
      true, // reverse each cycle, so it breathes in and out
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  return (
    <Animated.View style={[styles.card, pulseStyle]}>
      <View style={styles.titleBar} />
      <View style={styles.chipRow}>
        <View style={[styles.chip, { width: 72 }]} />
        <View style={[styles.chip, { width: 56 }]} />
        <View style={[styles.chip, { width: 84 }]} />
      </View>
    </Animated.View>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  card: {
    padding: spacing.md,
    gap: spacing.sm,
    borderRadius: radius.xl,
    borderWidth: border.width,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
  },
  titleBar: {
    height: 20,
    width: "70%",
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceContainerHigh,
  },
  chipRow: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  chip: {
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
  },
});
