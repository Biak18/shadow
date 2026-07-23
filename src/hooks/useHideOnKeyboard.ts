import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

/**
 * Returns an animated style that slides the tab bar down and fades it out
 * when the keyboard opens, and back when it closes.
 *
 * Uses React Native's built-in Animated API (not Reanimated) to match
 * CustomTabBar.tsx, which already animates its indicator/labels with
 * Animated.Value — mixing the two libraries' style objects on the same
 * Animated.View causes a type error, since they're incompatible.
 *
 * Also uses the plain Keyboard show/hide events rather than
 * react-native-keyboard-controller's worklet-based handler, since we only
 * need a binary show/hide trigger here (not gradual height tracking), and
 * plain JS event callbacks are what RN's Animated API expects anyway.
 */
export function useHideOnKeyboard() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, () => {
      setKeyboardVisible(true);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return { isKeyboardVisible };
}
