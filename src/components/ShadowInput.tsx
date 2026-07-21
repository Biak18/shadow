import { colors, radius, shadows, spacing, typography } from "@/theme/theme";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

type ShadowInputProps = TextInputProps & {
  label: string;
  errorText?: string;
  rightAdornment?: React.ReactNode;
};

/**
 * Level -1 "Recessed" input. Carved-in via inset shadow at rest;
 * focus swaps the inset shadow for a solid primary border, per DESIGN.md.
 */
export function ShadowInput({
  label,
  errorText,
  rightAdornment,
  onFocus,
  onBlur,
  style,
  ...rest
}: ShadowInputProps) {
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(errorText);

  return (
    <View style={[styles.wrapper, style as any]}>
      <Text style={styles.label} selectable={false}>
        {label}
      </Text>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: hasError
              ? colors.error
              : focused
                ? colors.primary
                : colors.outlineVariant,
            boxShadow: focused ? shadows.none : shadows.recessed,
          },
        ]}
      >
        <TextInput
          placeholderTextColor={colors.outline}
          style={[styles.input, style]}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {rightAdornment}
      </View>
      {hasError && (
        <Text style={styles.error} selectable>
          {errorText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.base,
  },
  label: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: typography.labelMd.fontSize,
    color: colors.onSurface,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: 2,
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface,
    paddingVertical: spacing.sm + 2,
  },
  error: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: typography.labelSm.fontSize,
    color: colors.error,
  },
});
