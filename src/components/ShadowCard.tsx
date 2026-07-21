import { border, colors, radius, shadows } from "@/theme/theme";
import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

type ShadowCardProps = {
  children: React.ReactNode;
  level?: "level1" | "level2";
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
};

/** Standard Shadow Logic card — 2px border, hard offset shadow, medium radius. */
export function ShadowCard({
  children,
  level = "level1",
  backgroundColor = colors.surfaceContainerLowest,
  style,
}: ShadowCardProps) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor,
          boxShadow: shadows[level],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: border.width,
    borderColor: colors.onBackground,
  },
});
