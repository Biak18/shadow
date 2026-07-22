import { router } from "expo-router";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ShadowButton } from "@/components/ShadowButton";
import { ShadowCard } from "@/components/ShadowCard";
import { ShadowChip } from "@/components/ShadowChip";
import { border, colors, radius, spacing, typography } from "@/theme/theme";

// ── Edit this block with your real info ──
const PROFILE = {
  name: "Chan Toe Whan",
  role: "Full Stack Developer",
  bio: "I build tactile, animation-forward mobile apps — mostly React Native and Expo, with a habit of caring more about how something feels to touch than how it looks in a screenshot.",
  now: "Currently building out a shadow-based design system and learning more about native performance tuning on the New Architecture.",
  skills: [
    "React Native",
    "TypeScript",
    "Reanimated",
    "Zustand",
    "Expo",
    "Supabase",
    "Node.js",
  ],
  resumeUrl:
    "https://drive.google.com/file/d/1Lbfzm3EQ58wVSXYUHd-_oPHxiSGaQc9u/view?usp=drivesdk",
};
// ──────────────────────────────────────────

export default function AboutScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.lg },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>About</Text>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.avatar}>
          {/* <Ionicons name="person" size={32} color={colors.onPrimary} /> */}
          <Image
            source={require("@/assets/images/author-pic.jpg")} // adjust path as needed
            style={styles.avatarImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.heroText}>
          <Text style={styles.name}>{PROFILE.name}</Text>
          <Text style={styles.role}>{PROFILE.role}</Text>
        </View>
      </View>

      {/* Bio */}
      <Text style={styles.bio}>{PROFILE.bio}</Text>

      {/* Skills */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Stack</Text>
        <View style={styles.chipRow}>
          {PROFILE.skills.map((skill) => (
            <ShadowChip key={skill} label={skill} tone="secondary" />
          ))}
        </View>
      </View>

      {/* Now */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Right now</Text>
        <ShadowCard level="level1" style={styles.nowCard}>
          <Text style={styles.nowText}>{PROFILE.now}</Text>
        </ShadowCard>
      </View>

      {/* CTAs */}
      <View style={styles.ctaRow}>
        <ShadowButton
          label="Get in touch"
          size="lg"
          onPress={() => router.push("/(tabs)/contact")}
          style={styles.ctaButton}
        />
        <ShadowButton
          label="Resume"
          variant="secondary"
          size="lg"
          onPress={() => Linking.openURL(PROFILE.resumeUrl)}
          style={styles.ctaButton}
        />
      </View>
    </ScrollView>
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
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    borderWidth: border.width,
    borderColor: colors.onBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  heroText: {
    gap: 2,
  },
  name: {
    fontFamily: typography.headlineLg.fontFamily,
    fontSize: 22,
    color: colors.onBackground,
  },
  role: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
  },
  bio: {
    fontFamily: typography.bodyLg.fontFamily,
    fontSize: typography.bodyLg.fontSize,
    lineHeight: typography.bodyLg.lineHeight,
    color: colors.onSurface,
  },
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: typography.labelMd.fontSize,
    letterSpacing: 1,
    color: colors.onSurfaceVariant,
    textTransform: "uppercase",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  nowCard: {
    padding: spacing.md,
  },
  nowText: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: typography.bodyMd.fontSize,
    lineHeight: typography.bodyMd.lineHeight,
    color: colors.onSurface,
  },
  ctaRow: {
    flexDirection: "row",
    gap: spacing.md,
    flexWrap: "wrap",
  },
  ctaButton: {
    flex: 1,
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
});
