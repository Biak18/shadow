import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import type { Project } from "@/stores/useProjectsStore";
import { colors, spacing, typography } from "@/theme/theme";
import { ShadowCard } from "./ShadowCard";
import { ShadowChip } from "./ShadowChip";

export function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  const progress = useSharedValue(0); // 0 = collapsed, 1 = expanded

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    progress.value = withTiming(next ? 1 : 0, { duration: 240 });
  };

  const detailsStyle = useAnimatedStyle(() => ({
    height: progress.value * contentHeight,
    opacity: progress.value,
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 180}deg` }],
  }));

  const hasLinks = project.github_url || project.live_url;

  return (
    <ShadowCard level={expanded ? "level2" : "level1"} style={styles.card}>
      <Pressable onPress={toggle} style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {project.title}
        </Text>
        <Animated.View style={chevronStyle}>
          <Ionicons
            name="chevron-down"
            size={18}
            color={colors.onSurfaceVariant}
          />
        </Animated.View>
      </Pressable>

      {!!project.tech_stack?.length && (
        <View style={styles.chipRow}>
          {project.tech_stack.map((tech) => (
            <ShadowChip key={tech} label={tech} tone="secondary" />
          ))}
        </View>
      )}

      {/* Always mounted so its natural height can be measured via onLayout;
          the outer Animated.View clips it to 0 when collapsed. */}
      <Animated.View style={[styles.detailsWrapper, detailsStyle]}>
        <View
          onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
          style={styles.details}
        >
          {!!project.description && (
            <Text style={styles.description}>{project.description}</Text>
          )}

          {hasLinks && (
            <View style={styles.linkRow}>
              {project.github_url && (
                <Pressable
                  style={styles.linkButton}
                  onPress={() => Linking.openURL(project.github_url!)}
                >
                  <Ionicons
                    name="logo-github"
                    size={16}
                    color={colors.onBackground}
                  />
                  <Text style={styles.linkText}>Code</Text>
                </Pressable>
              )}
              {project.live_url && (
                <Pressable
                  style={styles.linkButton}
                  onPress={() => Linking.openURL(project.live_url!)}
                >
                  <Ionicons
                    name="open-outline"
                    size={16}
                    color={colors.onBackground}
                  />
                  <Text style={styles.linkText}>Live</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </Animated.View>
    </ShadowCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    fontFamily: typography.headlineMd.fontFamily,
    fontSize: 18,
    color: colors.onBackground,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  detailsWrapper: {
    overflow: "hidden",
  },
  details: {
    gap: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  description: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: typography.bodyMd.fontSize,
    lineHeight: typography.bodyMd.lineHeight,
    color: colors.onSurfaceVariant,
  },
  linkRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.base,
  },
  linkText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: typography.labelMd.fontSize,
    color: colors.onBackground,
  },
});
