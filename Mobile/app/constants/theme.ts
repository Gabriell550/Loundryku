/**
 * theme.ts
 * Design tokens untuk "LaundriFlow" — Modern Glassmorphic theme
 * Diambil dari design.md (warna, tipografi, radius, spacing)
 */

export const colors = {
  surface: '#f7f9fb',
  surfaceDim: '#d8dadc',
  surfaceBright: '#f7f9fb',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f2f4f6',
  surfaceContainer: '#eceef0',
  surfaceContainerHigh: '#e6e8ea',
  surfaceContainerHighest: '#e0e3e5',

  onSurface: '#191c1e',
  onSurfaceVariant: '#414755',
  inverseSurface: '#2d3133',
  inverseOnSurface: '#eff1f3',

  outline: '#727786',
  outlineVariant: '#c1c6d7',

  // Ocean Blue — primary brand color
  primary: '#0058bf',
  onPrimary: '#ffffff',
  primaryContainer: '#006fef',
  onPrimaryContainer: '#fefcff',
  inversePrimary: '#aec6ff',

  // Fluid Aqua — fase "Washing"
  secondary: '#00696e',
  onSecondary: '#ffffff',
  secondaryContainer: '#00f4fe',
  onSecondaryContainer: '#006c71',

  // Warm Orange — fase "Ironing/Pressing" & status UNPAID
  tertiary: '#894d00',
  onTertiary: '#ffffff',
  tertiaryContainer: '#ac6300',
  onTertiaryContainer: '#fffbff',

  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',

  background: '#f7f9fb',
  onBackground: '#191c1e',

  // Bright Green — status PAID / Completion
  success: '#34c759',
} as const;

// Gradient brand asli dari design.md, dipakai khusus untuk tombol pill & aksen hero
export const gradients = {
  oceanToAqua: ['#0077FF', '#00F5FF'] as const,
  loginBackground: ['#eaf2ff', '#f7f9fb', '#e6fbff'] as const,
};

export const typography = {
  headlineXl: { fontFamily: 'Montserrat_700Bold', fontSize: 48, lineHeight: 56, letterSpacing: -0.4 },
  headlineLg: { fontFamily: 'Montserrat_700Bold', fontSize: 32, lineHeight: 40, letterSpacing: -0.2 },
  headlineLgMobile: { fontFamily: 'Montserrat_700Bold', fontSize: 24, lineHeight: 32 },
  headlineMd: { fontFamily: 'Montserrat_600SemiBold', fontSize: 20, lineHeight: 28 },
  bodyLg: { fontFamily: 'Inter_400Regular', fontSize: 18, lineHeight: 28 },
  bodyMd: { fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 24 },
  labelMd: { fontFamily: 'Inter_600SemiBold', fontSize: 14, lineHeight: 20, letterSpacing: 0.7 },
  labelSm: { fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 16, letterSpacing: 0.6 },
};

export const radius = {
  sm: 8,
  DEFAULT: 16,
  md: 24,
  lg: 32,
  xl: 48,
  full: 9999,
};

export const spacing = {
  unit: 8,
  containerPadding: 24,
  gutter: 16,
  stackSm: 8,
  stackMd: 16,
  stackLg: 32,
};