import { useEffect } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ProjectCard } from "@/components/ProjectCard";
import { useProjectsStore } from "@/stores/useProjectsStore";
import { border, colors, spacing, typography } from "@/theme/theme";

const TOP_BAR_HEIGHT = 44;
const FADE_DISTANCE = 40; // px of scroll over which the crossfade happens

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const {
    projects,
    loading,
    refreshing,
    error,
    fetchProjects,
    refreshProjects,
  } = useProjectsStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Big display title: fades out and drifts up slightly as you scroll.
  const bigTitleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, FADE_DISTANCE],
      [1, 0],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, FADE_DISTANCE],
          [0, -6],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  // Small sticky-bar title: fades in as the big one fades out.
  const smallTitleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [FADE_DISTANCE * 0.4, FADE_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  // Hairline under the sticky bar only appears once there's content
  // scrolled behind it — otherwise it'd show a stray line on an empty list.
  const topBarBorderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, FADE_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const topBarHeight = insets.top + TOP_BAR_HEIGHT;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Couldn't load projects.</Text>
        <Text style={styles.errorSub}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Animated.FlatList
        showsVerticalScrollIndicator={false}
        data={projects}
        keyExtractor={(item: { id: string }) => item.id}
        renderItem={({ item }: { item: any }) => <ProjectCard project={item} />}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: topBarHeight + spacing.xs },
        ]}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshProjects}
            tintColor={colors.primary}
            progressViewOffset={topBarHeight}
          />
        }
        ListHeaderComponent={
          <Animated.Text style={[styles.bigTitle, bigTitleStyle]}>
            Projects
          </Animated.Text>
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.errorText}>No projects yet.</Text>
          </View>
        }
      />

      {/* Fixed sticky bar — sits above the list, small title fades in here */}
      <View
        style={[
          styles.topBar,
          { height: topBarHeight, paddingTop: insets.top },
        ]}
        pointerEvents="none"
      >
        <Animated.Text style={[styles.smallTitle, smallTitleStyle]}>
          Projects
        </Animated.Text>
        <Animated.View style={[styles.topBarBorder, topBarBorderStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  bigTitle: {
    fontFamily: typography.display.fontFamily,
    fontSize: 34,
    color: colors.onBackground,
    marginBottom: spacing.lg,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    zIndex: 10,
  },
  smallTitle: {
    fontFamily: typography.headlineMd.fontFamily,
    fontSize: 18,
    color: colors.onBackground,
  },
  topBarBorder: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: border.width,
    backgroundColor: colors.onBackground,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingTop: spacing.xl * 2,
  },
  errorText: {
    fontFamily: typography.bodyLg.fontFamily,
    fontSize: typography.bodyLg.fontSize,
    color: colors.onBackground,
  },
  errorSub: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
  },
});
