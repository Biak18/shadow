import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCallback } from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { border, colors } from "@/theme/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Adjust these to make the button bigger or smaller
const BUTTON_SIZE = 48;
const RADIUS = BUTTON_SIZE / 2;
const SHADOW_OFFSET = 4; // Matches your spacing.shadowOffset

type SocialButtonProps = {
  url: string;
  iconName: keyof typeof Ionicons.glyphMap;
  brandColor: string;
};

export function SocialButton({ url, iconName, brandColor }: SocialButtonProps) {
  const translate = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translate.value },
      { translateY: translate.value },
    ],
  }));

  const handlePressIn = () => {
    translate.value = withTiming(SHADOW_OFFSET - 2, { duration: 80 });
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    translate.value = withTiming(0, { duration: 120 });
  };

  const handlePress = useCallback(async () => {
    try {
      // Just open it directly! The OS will route it to the app or the browser.
      await Linking.openURL(url);
    } catch (error) {
      console.error(`Failed to open URL: ${url}`, error);
      // Optional: Show an alert to the user here
    }
  }, [url]);

  return (
    <View style={styles.wrapper}>
      {/* Shadow layer */}
      <View style={styles.shadow} />

      {/* Interactive Button */}
      <AnimatedPressable
        accessibilityRole="button"
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.base,
          { backgroundColor: brandColor }, // Apply the brand color here
          animatedStyle,
        ]}
      >
        <Ionicons name={iconName} size={24} color="#ffffff" />
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    // Wrapper needs to be large enough to contain the button + the shadow offset
    width: BUTTON_SIZE + SHADOW_OFFSET,
    height: BUTTON_SIZE + SHADOW_OFFSET,
    position: "relative",
  },
  base: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: RADIUS,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: border.width,
    borderColor: colors.onBackground,
    position: "absolute",
    zIndex: 2,
  },
  shadow: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: RADIUS,
    backgroundColor: colors.onBackground,
    position: "absolute",
    top: SHADOW_OFFSET,
    left: SHADOW_OFFSET - 2,
    zIndex: 1,
  },
});
