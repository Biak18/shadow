import { colors, radius, spacing, typography } from "@/theme/theme";
import { StyleSheet, Text, View } from "react-native";

type ShadowChipProps = {
  label: string;
  tone?: "secondary" | "tertiary";
};

/** Flat 2D chip — no shadow, relies on high-contrast fill (per DESIGN.md). */
export function ShadowChip({ label, tone = "secondary" }: ShadowChipProps) {
  const bg = tone === "secondary" ? colors.secondary : colors.tertiary;
  const fg = tone === "secondary" ? colors.onSecondary : colors.onTertiary;

  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color: fg }]} selectable={false}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: "flex-start",
    borderRadius: radius.full,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.sm,
  },
  label: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: typography.labelSm.fontSize,
  },
});
