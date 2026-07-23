import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type ImageViewerProps = {
  visible: boolean;
  uri: string | null;
  onClose: () => void;
};

// Define how much it should zoom in on double-tap
const DOUBLE_TAP_SCALE = 2.5;

export function ImageViewer({ visible, uri, onClose }: ImageViewerProps) {
  // --- Entrance / Exit Animation ---
  const openAnim = useRef(new Animated.Value(0)).current;

  // --- Zoom / Pan Animation ---
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const scaleRef = useRef(1);
  const lastScale = useRef(1);
  const translateRef = useRef({ x: 0, y: 0 });
  const lastTranslate = useRef({ x: 0, y: 0 });
  const initialDistance = useRef<number | null>(null);
  const initialTouchMid = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (visible) {
      scaleRef.current = 1;
      lastScale.current = 1;
      translateRef.current = { x: 0, y: 0 };
      lastTranslate.current = { x: 0, y: 0 };
      scale.setValue(1);
      translateX.setValue(0);
      translateY.setValue(0);

      openAnim.setValue(0);
      Animated.spring(openAnim, {
        toValue: 1,
        damping: 20,
        mass: 1,
        stiffness: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, openAnim, scale, translateX, translateY]);

  function distance(t: any[]) {
    const dx = t[0].pageX - t[1].pageX;
    const dy = t[0].pageY - t[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function midpoint(t: any[]) {
    return {
      x: (t[0].pageX + t[1].pageX) / 2,
      y: (t[0].pageY + t[1].pageY) / 2,
    };
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        lastScale.current = scaleRef.current;
        lastTranslate.current = { ...translateRef.current };
        initialDistance.current = null;
      },

      onPanResponderMove: (evt, gs) => {
        const touches = evt.nativeEvent.touches;

        if (touches.length === 2) {
          const dist = distance(touches);
          const mid = midpoint(touches);

          if (initialDistance.current === null) {
            initialDistance.current = dist;
            initialTouchMid.current = mid;
            lastScale.current = scaleRef.current;
            lastTranslate.current = { ...translateRef.current };
          }

          const newScale = Math.min(
            Math.max(lastScale.current * (dist / initialDistance.current), 1),
            5,
          );
          scaleRef.current = newScale;
          scale.setValue(newScale);

          const tx =
            lastTranslate.current.x + (mid.x - initialTouchMid.current.x) * 0.5;
          const ty =
            lastTranslate.current.y + (mid.y - initialTouchMid.current.y) * 0.5;
          translateRef.current = { x: tx, y: ty };
          translateX.setValue(tx);
          translateY.setValue(ty);
        } else if (touches.length === 1 && scaleRef.current > 1) {
          const tx = lastTranslate.current.x + gs.dx;
          const ty = lastTranslate.current.y + gs.dy;
          translateRef.current = { x: tx, y: ty };
          translateX.setValue(tx);
          translateY.setValue(ty);
        }
      },

      onPanResponderRelease: () => {
        initialDistance.current = null;
        lastScale.current = scaleRef.current;
        lastTranslate.current = { ...translateRef.current };

        if (scaleRef.current <= 1) {
          scaleRef.current = 1;
          Animated.parallel([
            Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
            Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
          ]).start();
          translateRef.current = { x: 0, y: 0 };
          lastTranslate.current = { x: 0, y: 0 };
        }
      },
    }),
  ).current;

  const doubleTapRef = useRef<number>(0);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - doubleTapRef.current < 300) {
      // TOGGLE LOGIC: Check if we are already zoomed in
      if (scaleRef.current > 1) {
        // We are zoomed in -> Zoom out (reset)
        scaleRef.current = 1;
        lastScale.current = 1;
        translateRef.current = { x: 0, y: 0 };
        lastTranslate.current = { x: 0, y: 0 };

        Animated.parallel([
          Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
        ]).start();
      } else {
        // We are at normal size -> Zoom in
        scaleRef.current = DOUBLE_TAP_SCALE;
        lastScale.current = DOUBLE_TAP_SCALE;
        translateRef.current = { x: 0, y: 0 };
        lastTranslate.current = { x: 0, y: 0 };

        Animated.parallel([
          Animated.spring(scale, {
            toValue: DOUBLE_TAP_SCALE,
            useNativeDriver: true,
          }),
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
        ]).start();
      }
    }
    doubleTapRef.current = now;
  };

  const handleClose = () => {
    Animated.timing(openAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  if (!uri) return null;

  const entranceScale = openAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={lb.root}>
        {/* Animated Background */}
        <Animated.View
          style={[StyleSheet.absoluteFill, lb.overlayBg, { opacity: openAnim }]}
        />

        {/* Close Button */}
        <Animated.View style={[lb.closeBtn, { opacity: openAnim }]}>
          <TouchableOpacity onPress={handleClose}>
            <Ionicons name="close-circle" size={36} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        {/* Zoomable Area wrapped in an Entrance Animation */}
        <Animated.View
          style={[
            lb.imageArea,
            {
              opacity: openAnim,
              transform: [{ scale: entranceScale }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <TouchableOpacity activeOpacity={1} onPress={handleDoubleTap}>
            <Animated.Image
              source={{ uri }}
              style={[
                lb.image,
                {
                  transform: [{ scale }, { translateX }, { translateY }],
                },
              ]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Hint */}
        {/* <Animated.View style={[lb.hintRow, { opacity: openAnim }]}>
          <Ionicons
            name="search-outline"
            size={13}
            color="rgba(255,255,255,0.4)"
          />
          <Text style={lb.hint}>Double-tap to zoom in/out</Text>
        </Animated.View> */}
      </View>
    </Modal>
  );
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

const lb = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
  },
  overlayBg: {
    backgroundColor: "rgba(0,0,0,0.96)",
  },
  closeBtn: {
    position: "absolute",
    top: 52,
    right: 16,
    zIndex: 10,
  },
  imageArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: SCREEN_W,
    height: SCREEN_H * 0.82,
  },
  hintRow: {
    position: "absolute",
    bottom: 38,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  hint: { color: "rgba(255,255,255,0.35)", fontSize: 12 },
});
