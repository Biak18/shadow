import { Pressable, StyleSheet, Text, View } from "react-native";

import { border, colors, radius, spacing, typography } from "@/theme/theme";

type OptionSelectorProps<T extends string> = {
  label: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
};

export function OptionSelector<T extends string>({
  label,
  options,
  value,
  onChange,
}: OptionSelectorProps<T>) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map((option) => {
          const selected = option === value;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              style={[styles.pill, selected && styles.pillSelected]}
            >
              <Text
                style={[styles.pillText, selected && styles.pillTextSelected]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  label: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: typography.labelMd.fontSize,
    color: colors.onSurfaceVariant,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  pill: {
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    borderWidth: border.width,
    borderColor: colors.onBackground,
    backgroundColor: colors.surfaceContainerLowest,
  },
  pillSelected: {
    backgroundColor: colors.primary,
  },
  pillText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: typography.labelSm.fontSize,
    color: colors.onBackground,
  },
  pillTextSelected: {
    color: colors.onPrimary,
  },
});
