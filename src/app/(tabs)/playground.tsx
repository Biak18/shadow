import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { OptionSelector } from "@/components/OptionSelector";
import { ShadowButton } from "@/components/ShadowButton";
import { ShadowCard } from "@/components/ShadowCard";
import { ShadowChip } from "@/components/ShadowChip";
import { ShadowInput } from "@/components/ShadowInput";
import { colors, spacing, typography } from "@/theme/theme";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const useGradualAnimation = (bottomInset: number) => {
  const height = useSharedValue(bottomInset);

  useKeyboardHandler(
    {
      onMove: (e) => {
        "worklet";
        height.value = Math.max(e.height, bottomInset);
      },
      onEnd: (e) => {
        "worklet";
        height.value = e.height > 0 ? e.height : bottomInset;
      },
    },
    [bottomInset],
  );
  return { height };
};

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";
type CardLevel = "level1" | "level2";
type ChipTone = "secondary" | "tertiary";

export default function PlaygroundScreen() {
  const insets = useSafeAreaInsets();
  const { height } = useGradualAnimation(insets.bottom);

  // Button controls
  const [buttonVariant, setButtonVariant] = useState<ButtonVariant>("primary");
  const [buttonSize, setButtonSize] = useState<ButtonSize>("lg");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // Card controls
  const [cardLevel, setCardLevel] = useState<CardLevel>("level1");

  // Chip controls
  const [chipTone, setChipTone] = useState<ChipTone>("secondary");

  // Input controls
  const [inputValue, setInputValue] = useState("");
  const [inputHasError, setInputHasError] = useState(false);

  const fakeView = useAnimatedStyle(() => {
    return {
      height: Math.max(height.value, 0),
    };
  }, []);

  return (
    /* Exclude bottom edge so SafeAreaView doesn't double-pad */
    <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Playground</Text>
        <Text style={styles.subheading}>
          Every component, live. Toggle the controls, watch it update.
        </Text>

        {/* Button */}
        <Section title="ShadowButton">
          <View style={styles.preview}>
            <ShadowButton
              label={buttonLoading ? "Loading" : "Press me"}
              variant={buttonVariant}
              size={buttonSize}
              loading={buttonLoading}
              disabled={buttonDisabled}
              onPress={() => {}}
            />
          </View>
          <OptionSelector
            label="Variant"
            options={["primary", "secondary", "ghost"] as ButtonVariant[]}
            value={buttonVariant}
            onChange={setButtonVariant}
          />
          <OptionSelector
            label="Size"
            options={["md", "lg"] as ButtonSize[]}
            value={buttonSize}
            onChange={setButtonSize}
          />
          <ToggleRow
            label="Loading"
            value={buttonLoading}
            onChange={setButtonLoading}
          />
          <ToggleRow
            label="Disabled"
            value={buttonDisabled}
            onChange={setButtonDisabled}
          />
        </Section>

        {/* Card */}
        <Section title="ShadowCard">
          <View style={styles.preview}>
            <ShadowCard level={cardLevel} style={styles.cardPreview}>
              <Text style={styles.cardPreviewText}>
                {cardLevel === "level1" ? "Lift" : "High Lift"}
              </Text>
            </ShadowCard>
          </View>
          <OptionSelector
            label="Elevation"
            options={["level1", "level2"] as CardLevel[]}
            value={cardLevel}
            onChange={setCardLevel}
          />
        </Section>

        {/* Chip */}
        <Section title="ShadowChip">
          <View style={styles.preview}>
            <ShadowChip label="Design system" tone={chipTone} />
          </View>
          <OptionSelector
            label="Tone"
            options={["secondary", "tertiary"] as ChipTone[]}
            value={chipTone}
            onChange={setChipTone}
          />
        </Section>

        {/* Input */}
        <Section title="ShadowInput">
          <View style={styles.preview}>
            <ShadowInput
              label="Try it"
              placeholder="Type something…"
              value={inputValue}
              onChangeText={setInputValue}
              errorText={inputHasError ? "Something's off here" : undefined}
              style={{ width: "100%" }}
            />
          </View>
          <ToggleRow
            label="Show error state"
            value={inputHasError}
            onChange={setInputHasError}
          />
        </Section>
      </ScrollView>
      <Animated.View style={fakeView} />
    </SafeAreaView>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <OptionSelector
      label={label}
      options={["off", "on"]}
      value={value ? "on" : "off"}
      onChange={(v) => onChange(v === "on")}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2,
    gap: spacing.xl,
  },
  heading: {
    fontFamily: typography.display.fontFamily,
    fontSize: 34,
    color: colors.onBackground,
  },
  subheading: {
    fontFamily: typography.bodyLg.fontFamily,
    fontSize: typography.bodyLg.fontSize,
    lineHeight: typography.bodyLg.lineHeight,
    color: colors.onSurfaceVariant,
    marginTop: -spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontFamily: typography.headlineMd.fontFamily,
    fontSize: 18,
    color: colors.onBackground,
  },
  preview: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainer,
  },
  cardPreview: {
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  cardPreviewText: {
    fontFamily: typography.headlineMd.fontFamily,
    fontSize: 16,
    color: colors.onBackground,
  },
});
