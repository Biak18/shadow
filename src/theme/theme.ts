/**
 * Shadow Logic — Theme
 * Neubrutalist-Tactile design system. Single-file theme: colors, spacing,
 * radius, typography, and shadows/elevation all live here.
 *
 * Primary swapped from the original "Electric Indigo" purple to
 * "Signal Orange" — bolder, less generic, and it reads more energetic
 * against the Rose secondary + Emerald tertiary.
 *
 * Color structure mirrors Material 3 color roles so it's easy to extend
 * to dark mode later (see DESIGN.md note on obsidian neutrals + tinted glow).
 */

// ─────────────────────────────────────────────────────────────────────────
// Colors
// ─────────────────────────────────────────────────────────────────────────

export const colors = {
  // Surfaces / neutrals — "Paper" warm cream, unchanged from source system
  surface: "#faf9f8",
  surfaceDim: "#dadad9",
  surfaceBright: "#faf9f8",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f4f3f2",
  surfaceContainer: "#eeeeed",
  surfaceContainerHigh: "#e9e8e7",
  surfaceContainerHighest: "#e3e2e1",
  surfaceVariant: "#e3e2e1",

  onSurface: "#1a1c1c",
  onSurfaceVariant: "#464554",
  inverseSurface: "#2f3130",
  inverseOnSurface: "#f1f0f0",

  outline: "#767586",
  outlineVariant: "#c7c4d7",

  background: "#faf9f8",
  onBackground: "#1a1c1c",

  // Primary — Signal Orange (replaces Electric Indigo)
  surfaceTint: "#ff5a1f",
  primary: "#ff5a1f",
  onPrimary: "#ffffff",
  primaryContainer: "#ffb68c",
  onPrimaryContainer: "#3e1400",
  primaryFixed: "#ffdbc7",
  primaryFixedDim: "#ffb68c",
  onPrimaryFixed: "#4a1400",
  onPrimaryFixedVariant: "#b23d00",
  inversePrimary: "#ffb68c",

  // Secondary — Neon Rose, unchanged
  secondary: "#b90538",
  onSecondary: "#ffffff",
  secondaryContainer: "#dc2c4f",
  onSecondaryContainer: "#fffbff",
  secondaryFixed: "#ffdadb",
  secondaryFixedDim: "#ffb2b7",
  onSecondaryFixed: "#40000d",
  onSecondaryFixedVariant: "#92002a",

  // Tertiary — Emerald, unchanged
  tertiary: "#006c49",
  onTertiary: "#ffffff",
  tertiaryContainer: "#00885d",
  onTertiaryContainer: "#000703",
  tertiaryFixed: "#6ffbbe",
  tertiaryFixedDim: "#4edea3",
  onTertiaryFixed: "#002113",
  onTertiaryFixedVariant: "#005236",

  // System
  error: "#ba1a1a",
  onError: "#ffffff",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",

  // Shadow — always a true black, never soft grey (keeps the 3D-pop effect)
  shadow: "#1a1c1c",
} as const;

export type ColorToken = keyof typeof colors;

// ─────────────────────────────────────────────────────────────────────────
// Spacing
// 4px base grid. `shadowOffset` drives the "Lift" — the distance every
// hard shadow sits from its element, per DESIGN.md.
// ─────────────────────────────────────────────────────────────────────────

export const spacing = {
  base: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  shadowOffset: 4,
  shadowOffsetLg: 8,
} as const;

export type SpacingToken = keyof typeof spacing;

// ─────────────────────────────────────────────────────────────────────────
// Radius
// "Medium Roundedness" — 8-12px standard so hard shadows read as
// integrated blocks rather than raw Brutalism.
// ─────────────────────────────────────────────────────────────────────────

export const radius = {
  sm: 4, // 0.25rem
  md: 8, // buttons, inputs
  lg: 12, // DEFAULT container radius
  xl: 16, // cards
  xxl: 24, // hero / featured containers
  full: 9999, // avatars, pills
} as const;

export type RadiusToken = keyof typeof radius;

// ─────────────────────────────────────────────────────────────────────────
// Typography
// Lexend exclusively. Font family keys below match the family names
// registered by @expo-google-fonts/lexend (see README for setup).
// ─────────────────────────────────────────────────────────────────────────

export const fontFamily = {
  regular: "Lexend_400Regular",
  medium: "Lexend_500Medium",
  semibold: "Lexend_600SemiBold",
  bold: "Lexend_700Bold",
  extrabold: "Lexend_800ExtraBold",
} as const;

export const typography = {
  display: {
    fontFamily: fontFamily.extrabold,
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: -0.5,
  },
  headlineLg: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.3,
  },
  headlineLgMobile: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0,
  },
  headlineMd: {
    fontFamily: fontFamily.semibold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
  },
  bodyLg: {
    fontFamily: fontFamily.regular,
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 0,
  },
  bodyMd: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  labelMd: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.14,
  },
  labelSm: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.1,
  },
} as const;

export type TypographyToken = keyof typeof typography;

// ─────────────────────────────────────────────────────────────────────────
// Shadows / Elevation
//
// Uses React Native's CSS `boxShadow` style prop (New Architecture),
// NOT the legacy `shadowColor`/`shadowOffset`/`elevation` props — those
// can't produce a true hard, zero-blur edge and don't support inset.
//
// Levels match DESIGN.md:
//  0  Floor        — base background, no shadow
//  1  Lift         — 4px hard offset, standard cards / buttons
//  2  High Lift    — 8px hard offset + soft ambient glow, primary CTAs
// -1  Recessed      — inset shadow, inputs / search bars
// ─────────────────────────────────────────────────────────────────────────

const shadowRgb = "26, 28, 28"; // colors.onBackground / colors.shadow as rgb

export const shadows = {
  none: "none",

  level1: `4px 4px 0px 0px rgba(${shadowRgb}, 1)`,

  level2: [
    `8px 8px 0px 0px rgba(${shadowRgb}, 1)`,
    `14px 18px 28px 0px rgba(${shadowRgb}, 0.18)`,
  ].join(", "),

  recessed: [
    `inset 2px 2px 4px 0px rgba(${shadowRgb}, 0.28)`,
    `inset -1px -1px 2px 0px rgba(255, 255, 255, 0.7)`,
  ].join(", "),

  // Pressed state — shadow collapses to simulate the element hitting the floor
  pressed: "0px 0px 0px 0px rgba(0, 0, 0, 0)",
} as const;

export const border = {
  width: 2,
  color: colors.onBackground,
} as const;

export type ShadowToken = keyof typeof shadows;
