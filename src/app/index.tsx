import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  ShadowButton,
  ShadowCard,
  ShadowChip,
  ShadowInput,
} from "@/components";
import { colors, radius, spacing, typography } from "@/theme/theme";
import { useKeyboardHandler } from "react-native-keyboard-controller";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SLIDE_COUNT = 3;
const PADDING_BOTTOM = Platform.OS === "ios" ? 20 : 0;
const useGradualAnimation = () => {
  const height = useSharedValue(PADDING_BOTTOM);

  useKeyboardHandler(
    {
      onMove: (e) => {
        "worklet";
        height.value = Math.max(e.height, PADDING_BOTTOM);
      },
      onEnd: (e) => {
        "worklet";
        height.value = e.height;
      },
    },
    [],
  );
  return { height };
};

export default function OnboardingScreen() {
  const { height } = useGradualAnimation();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (page !== index) setIndex(page);
  };

  const goToSlide = (next: number) => {
    scrollRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
    setIndex(next);
  };

  const finish = () => {
    router.replace("/(tabs)");
  };

  const fakeView = useAnimatedStyle(() => {
    return {
      height: Math.max(height.value, 0),
    };
  }, []);

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyboardDismissMode="on-drag"
      >
        {/* Slide 1 — Press it */}
        <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
          <View style={styles.slideBody}>
            <Text style={styles.eyebrow}>01 — TACTILE</Text>
            <Text style={styles.headline}>Press it.</Text>
            <Text style={styles.sub}>
              Every button here reacts like a physical object — it sinks, the
              shadow disappears, it comes back up.
            </Text>
          </View>
          <View style={styles.demoArea}>
            <ShadowButton label="Go ahead, press me" size="lg" />
          </View>
        </View>

        {/* Slide 2 — Built in layers */}
        <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
          <View style={styles.slideBody}>
            <Text style={styles.eyebrow}>02 — DEPTH</Text>
            <Text style={styles.headline}>Built in layers.</Text>
            <Text style={styles.sub}>
              Two elevation levels, one flat surface. Made with:
            </Text>
            <View style={styles.chipRow}>
              <ShadowChip label="React Native" tone="secondary" />
              <ShadowChip label="Reanimated" tone="tertiary" />
              <ShadowChip label="Zustand" tone="secondary" />
              <ShadowChip label="Expo" tone="tertiary" />
            </View>
          </View>
          <View style={styles.cardRow}>
            <ShadowCard level="level1" style={styles.demoCard}>
              <Text style={styles.cardLabel}>Level 1</Text>
              <Text style={styles.cardCaption}>Lift</Text>
            </ShadowCard>
            <ShadowCard level="level2" style={styles.demoCard}>
              <Text style={styles.cardLabel}>Level 2</Text>
              <Text style={styles.cardCaption}>High Lift</Text>
            </ShadowCard>
          </View>
        </View>

        {/* Slide 3 — Try typing */}
        <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
          <View style={styles.slideBody}>
            <Text style={styles.eyebrow}>03 — CARVED IN</Text>
            <Text style={styles.headline}>Try typing.</Text>
            <Text style={styles.sub}>
              Inputs sit recessed at rest, and pop flush the moment you focus
              them.
            </Text>
          </View>
          <View style={styles.demoArea}>
            <ShadowInput
              label="Say something"
              placeholder="Type here…"
              value={inputValue}
              onChangeText={setInputValue}
              style={styles.inputDemo}
            />
            <ShadowButton
              label="Enter"
              size="lg"
              style={styles.enterButton}
              onPress={finish}
            />
            <Animated.View style={fakeView} />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ProgressDots count={SLIDE_COUNT} activeIndex={index} />

        <View style={styles.footerActions}>
          {index < SLIDE_COUNT - 1 ? (
            <>
              <ShadowButton
                label="Skip"
                variant="ghost"
                size="md"
                onPress={finish}
              />
              <ShadowButton
                label="Next"
                size="md"
                onPress={() => goToSlide(index + 1)}
              />
            </>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function ProgressDots({
  count,
  activeIndex,
}: {
  count: number;
  activeIndex: number;
}) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: count }).map((_, i) => (
        <Dot key={i} active={i === activeIndex} />
      ))}
    </View>
  );
}

function Dot({ active }: { active: boolean }) {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: 180 });
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: 8 + progress.value * 16,
    backgroundColor: active ? colors.primary : colors.outlineVariant,
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  slide: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl * 2,
    paddingBottom: spacing.xl,
  },
  slideBody: {
    gap: spacing.sm,
  },
  eyebrow: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: typography.labelMd.fontSize,
    letterSpacing: 1.5,
    color: colors.primary,
  },
  headline: {
    fontFamily: typography.display.fontFamily,
    fontSize: 40,
    lineHeight: 46,
    color: colors.onBackground,
  },
  sub: {
    fontFamily: typography.bodyLg.fontFamily,
    fontSize: typography.bodyLg.fontSize,
    lineHeight: typography.bodyLg.lineHeight,
    color: colors.onSurfaceVariant,
    maxWidth: 320,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  demoArea: {
    alignItems: "center",
    gap: spacing.lg,
  },
  inputDemo: {
    width: "100%",
  },
  enterButton: {
    alignSelf: "center",
  },
  cardRow: {
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "center",
  },
  demoCard: {
    flex: 1,
    maxWidth: 160,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
  },
  cardLabel: {
    fontFamily: typography.headlineMd.fontFamily,
    fontSize: 20,
    color: colors.onBackground,
  },
  cardCaption: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: typography.labelSm.fontSize,
    color: colors.onSurfaceVariant,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
  },
  dot: {
    height: 8,
    borderRadius: radius.full,
  },
  footerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
