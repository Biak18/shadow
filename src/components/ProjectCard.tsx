import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import type { Project } from "@/stores/useProjectsStore";
import { border, colors, radius, spacing, typography } from "@/theme/theme";
import { ImageViewer } from "./ImageViewer";
import { ShadowCard } from "./ShadowCard";
import { ShadowChip } from "./ShadowChip";

const CARD_PADDING = spacing.md;

export function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  const progress = useSharedValue(0); // 0 = collapsed, 1 = expanded

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    progress.value = withTiming(next ? 1 : 0, { duration: 220 });
  };

  const detailsStyle = useAnimatedStyle(
    () => ({
      height: progress.value * contentHeight,
      opacity: progress.value,
    }),
    [contentHeight],
  );

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 180}deg` }],
  }));

  const hasLinks = project.github_url || project.live_url;

  // ── Image viewer ──
  const [viewerVisible, setViewerVisible] = useState(false);

  const openViewer = () => {
    setViewerVisible(true);
  };

  return (
    <ShadowCard level={expanded ? "level2" : "level1"} style={styles.card}>
      {!!project.cover_image_url && (
        <Pressable onPress={openViewer}>
          <Image
            source={{ uri: project.cover_image_url }}
            style={styles.cover}
            resizeMode="cover"
          />
        </Pressable>
      )}

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

      <View
        style={styles.measureCopy}
        pointerEvents="none"
        onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
      >
        <DetailsContent project={project} hasLinks={hasLinks} />
      </View>

      <Animated.View style={[styles.detailsWrapper, detailsStyle]}>
        <DetailsContent project={project} hasLinks={hasLinks} />
      </Animated.View>

      <ImageViewer
        visible={viewerVisible}
        uri={project.cover_image_url}
        onClose={() => setViewerVisible(false)}
      />
    </ShadowCard>
  );
}

function DetailsContent({
  project,
  hasLinks,
}: {
  project: Project;
  hasLinks: string | null | undefined;
}) {
  return (
    <View style={styles.details}>
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
  );
}

const styles = StyleSheet.create({
  card: {
    padding: CARD_PADDING,
    gap: spacing.sm,
  },
  cover: {
    height: 160,
    alignSelf: "stretch",
    marginTop: -CARD_PADDING,
    marginHorizontal: -CARD_PADDING,
    marginBottom: spacing.xs,
    borderTopLeftRadius: radius.xl - border.width,
    borderTopRightRadius: radius.xl - border.width,
    backgroundColor: colors.surfaceContainerHigh,
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
  measureCopy: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    opacity: 0,
    zIndex: -1,
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
