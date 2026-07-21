import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  LayoutChangeEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { border, colors, radius, spacing, typography } from "@/theme/theme";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

type ShadowButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ShadowButton({
  label,
  onPress,
  variant = "primary",
  size = "lg",
  icon,
  iconPosition = "right",
  loading = false,
  disabled = false,
  style,
}: ShadowButtonProps) {
  const offset = size === "lg" ? spacing.shadowOffsetLg : spacing.shadowOffset;

  const translate = useSharedValue(0);
  const [buttonSize, setButtonSize] = useState({ width: 0, height: 0 });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translate.value },
      { translateY: translate.value },
    ],
  }));

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setButtonSize({ width, height });
  };

  const handlePressIn = () => {
    if (disabled || loading) return;

    translate.value = withTiming(offset, { duration: 80 });

    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    if (disabled || loading) return;

    translate.value = withTiming(0, { duration: 120 });
  };

  const variantStyle = variantStyles[variant];
  const showShadow = variant !== "ghost" && buttonSize.width > 0;

  return (
    <View style={[styles.wrapper, style]}>
      {/* Shadow — explicitly sized to match the button, not inferred from insets */}
      {showShadow && (
        <View
          style={[
            styles.shadow,
            {
              width: buttonSize.width,
              height: buttonSize.height,
              top: offset,
              left: offset,
              borderRadius: radius.md,
            },
          ]}
        />
      )}

      {/* Button */}
      <AnimatedPressable
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading }}
        disabled={disabled || loading}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onLayout={handleLayout}
        style={[
          styles.base,
          size === "lg" ? styles.sizeLg : styles.sizeMd,
          variantStyle.container,
          animatedStyle,
          (disabled || loading) && styles.disabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={variantStyle.text.color} />
        ) : (
          <>
            {icon && iconPosition === "left" && icon}
            <Text selectable={false} style={[styles.label, variantStyle.text]}>
              {label}
            </Text>
            {icon && iconPosition === "right" && icon}
          </>
        )}
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "flex-start",
    position: "relative",
  },

  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: border.width,
    borderColor: colors.onBackground,
    position: "relative",
    zIndex: 2,
  },

  shadow: {
    position: "absolute",
    backgroundColor: colors.onBackground,
    zIndex: 1,
  },

  sizeLg: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  sizeMd: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  label: {
    fontFamily: typography.headlineMd.fontFamily,
    fontSize: 16,
  },

  disabled: {
    opacity: 0.45,
  },
});

const variantStyles: Record<
  Variant,
  { container: StyleProp<ViewStyle>; text: { color: string } }
> = {
  primary: {
    container: { backgroundColor: colors.primary },
    text: { color: colors.onPrimary },
  },
  secondary: {
    container: { backgroundColor: colors.secondary },
    text: { color: colors.onSecondary },
  },
  ghost: {
    container: { backgroundColor: "transparent" },
    text: { color: colors.onBackground },
  },
};
