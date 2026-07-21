import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  border,
  colors,
  fontFamily,
  radius,
  shadows,
  spacing,
} from "@/theme/theme";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const TABS: {
  icon: IoniconsName;
  activeIcon: IoniconsName;
  label: string;
}[] = [
  { icon: "layers-outline", activeIcon: "layers", label: "Home" },
  { icon: "person-outline", activeIcon: "person", label: "About" },
  { icon: "mail-outline", activeIcon: "mail", label: "Contact" },
  { icon: "color-wand-outline", activeIcon: "color-wand", label: "Playground" },
];

const INDICATOR_SIZE = 44;
const BAR_HEIGHT = 60;
const INDICATOR_TOP = (BAR_HEIGHT - INDICATOR_SIZE) / 2;

type TabLayout = { x: number; width: number };

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const indicatorX = useRef(new Animated.Value(0)).current;
  // Real measured position/width per tab — matches whatever pixel
  // rounding Yoga actually applied, instead of a divided estimate.
  const [tabLayouts, setTabLayouts] = useState<Record<number, TabLayout>>({});

  const activeIndex = state.index;
  const activeLayout = tabLayouts[activeIndex];

  useEffect(() => {
    if (!activeLayout) return;

    const targetX = activeLayout.x + (activeLayout.width - INDICATOR_SIZE) / 2;

    Animated.spring(indicatorX, {
      toValue: targetX,
      useNativeDriver: true,
      damping: 18,
      stiffness: 220,
      mass: 0.7,
    }).start();
  }, [activeIndex, activeLayout?.x, activeLayout?.width]);

  const handleTabLayout = (index: number) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setTabLayouts((prev) => ({ ...prev, [index]: { x, width } }));
  };

  return (
    <View
      style={[
        styles.wrapper,
        { paddingBottom: Math.max(insets.bottom, spacing.lg) },
      ]}
    >
      <View style={styles.bar}>
        {activeLayout && (
          <Animated.View
            style={[
              styles.indicator,
              { transform: [{ translateX: indicatorX }] },
            ]}
          />
        )}

        {state.routes.map((route, index) => {
          const tab = TABS[index] ?? {
            icon: "ellipse-outline",
            activeIcon: "ellipse",
            label: route.name,
          };
          const isActive = state.index === index;

          const handlePress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isActive && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabItem
              key={route.key}
              tab={tab}
              isActive={isActive}
              onPress={handlePress}
              onLayout={handleTabLayout(index)}
            />
          );
        })}
      </View>
    </View>
  );
}

function TabItem({
  tab,
  isActive,
  onPress,
  onLayout,
}: {
  tab: (typeof TABS)[number];
  isActive: boolean;
  onPress: () => void;
  onLayout: (e: LayoutChangeEvent) => void;
}) {
  const iconTranslateY = useRef(new Animated.Value(isActive ? 8 : 0)).current;
  const iconScale = useRef(new Animated.Value(isActive ? 1.1 : 1)).current;
  const labelOpacity = useRef(new Animated.Value(isActive ? 0 : 1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(iconTranslateY, {
        toValue: isActive ? 8 : 0,
        useNativeDriver: true,
        damping: 15,
        stiffness: 200,
        mass: 0.6,
      }),
      Animated.spring(iconScale, {
        toValue: isActive ? 1.1 : 1,
        useNativeDriver: true,
        damping: 12,
        stiffness: 200,
        mass: 0.6,
      }),
      Animated.timing(labelOpacity, {
        toValue: isActive ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isActive]);

  const contentColor = isActive ? colors.onPrimary : colors.onSurfaceVariant;

  return (
    <TouchableOpacity
      style={styles.tab}
      onPress={onPress}
      onLayout={onLayout}
      activeOpacity={0.7}
      disabled={isActive}
    >
      <Animated.View
        style={{
          paddingLeft: 4,
          transform: [{ translateY: iconTranslateY }, { scale: iconScale }],
        }}
      >
        <Ionicons
          name={isActive ? tab.activeIcon : tab.icon}
          size={20}
          color={contentColor}
        />
      </Animated.View>
      <Animated.Text
        style={[styles.label, { opacity: labelOpacity, color: contentColor }]}
        numberOfLines={1}
      >
        {tab.label}
      </Animated.Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    height: BAR_HEIGHT,
    borderRadius: radius.xl,
    borderWidth: border.width,
    borderColor: colors.onBackground,
    backgroundColor: colors.surfaceContainerLowest,
    position: "relative",
    boxShadow: shadows.level1,
  },
  indicator: {
    position: "absolute",
    left: 0,
    top: INDICATOR_TOP,
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    borderRadius: INDICATOR_SIZE / 2,
    backgroundColor: colors.primary,
    borderWidth: border.width,
    borderColor: colors.onBackground,
    boxShadow: "2px 2px 0px 0px rgba(26,28,28, 1)",
    zIndex: 0,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    gap: 2,
    zIndex: 1,
  },
  label: {
    fontSize: 10,
    fontFamily: fontFamily.medium,
  },
});
