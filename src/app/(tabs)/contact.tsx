import { useState } from "react";
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ShadowButton } from "@/components/ShadowButton";
import { ShadowInput } from "@/components/ShadowInput";
import { colors, spacing, typography } from "@/theme/theme";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

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

const CONTACT_EMAIL = "biakceu912@gmail.com";
const FORM_ENDPOINT: string | null = null;

type FormState = {
  name: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactScreen() {
  const insets = useSafeAreaInsets();
  const { height } = useGradualAnimation();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const updateField = (field: keyof FormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    if (!form.name.trim()) nextErrors.name = "Tell me your name";
    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      nextErrors.email = "That email doesn't look right";
    }
    if (!form.message.trim()) nextErrors.message = "Say something first";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (FORM_ENDPOINT) {
      setStatus("sending");
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Request failed");
        setStatus("sent");
      } catch {
        setStatus("idle");
        setErrors({ message: "Couldn't send — try again in a moment." });
      }
      return;
    }

    // Fallback: open the mail client with everything pre-filled.
    const subject = encodeURIComponent(`Portfolio contact — ${form.name}`);
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name} (${form.email})`,
    );
    Linking.openURL(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`);
    setStatus("sent");
  };

  const fakeView = useAnimatedStyle(() => {
    return {
      height: Math.max(height.value, 0),
    };
  }, []);

  if (status === "sent") {
    return (
      <View style={[styles.root, styles.centered]}>
        <Text style={styles.sentTitle}>Sent.</Text>
        <Text style={styles.sentSub}>
          Thanks for reaching out — I'll get back to you soon.
        </Text>
        <ShadowButton
          label="Send another"
          variant="ghost"
          size="md"
          onPress={() => {
            setForm({ name: "", email: "", message: "" });
            setStatus("idle");
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.lg },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Contact</Text>
        <Text style={styles.subheading}>
          Have a project in mind, or just want to say hi? Drop a note below.
        </Text>

        <View style={styles.form}>
          <ShadowInput
            label="Name"
            placeholder="Ada Lovelace"
            value={form.name}
            onChangeText={updateField("name")}
            errorText={errors.name}
            autoCapitalize="words"
          />
          <ShadowInput
            label="Email"
            placeholder="ada@example.com"
            value={form.email}
            onChangeText={updateField("email")}
            errorText={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <ShadowInput
            label="Message"
            placeholder="What's on your mind?"
            value={form.message}
            onChangeText={updateField("message")}
            errorText={errors.message}
            multiline
            numberOfLines={5}
            style={styles.messageInput}
          />
        </View>

        <ShadowButton
          label={status === "sending" ? "Sending…" : "Send message"}
          size="lg"
          onPress={handleSubmit}
          loading={status === "sending"}
        />
      </ScrollView>
      <Animated.View style={fakeView} />
    </View>
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
  form: {
    gap: spacing.md,
  },
  messageInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  sentTitle: {
    fontFamily: typography.headlineLg.fontFamily,
    fontSize: 28,
    color: colors.onBackground,
  },
  sentSub: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
    textAlign: "center",
    marginBottom: spacing.md,
  },
});
