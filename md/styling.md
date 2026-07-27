# Styling Approach in LaundriFlow Mobile

This document outlines the styling methodology and design system principles used in the LaundriFlow mobile application. The application adheres to a "Glassmorphic" design, primarily implemented using Expo React Native.

## Core Principles

-   **Design Tokens**: All styling values (colors, typography, spacing, radius) are centralized in `Mobile/constants/theme.ts` to ensure consistency and easy modification across the application.
-   **Glassmorphic Design**: Utilizes `BlurView` and `LinearGradient` for visual effects, providing a modern, frosted glass appearance.
-   **Component-Based Styling**: Styles are applied per component using `StyleSheet.create` for encapsulation and reusability.
-   **Theming**: A dark mode/light mode switch is not explicitly mentioned but the color palette supports a clear hierarchy.

## Design System Overview

### 1. Colors (`Mobile/constants/theme.ts` - `colors` export)

The color palette is defined with semantic names, focusing on usability and brand identity.

| Category             | Name                          | Hex Value  | Description                                       |
| :------------------- | :---------------------------- | :--------- | :------------------------------------------------ |
| **Surface**          | `surface`                     | `#f7f9fb`  | Default background surface                        |
|                      | `surfaceDim`                  | `#d8dadc`   | Dimmed surface variant                            |
|                      | `surfaceBright`               | `#f7f9fb`  | Bright surface variant                            |
|                      | `surfaceContainerLowest`      | `#ffffff`  | Lowest elevation container                        |
|                      | `surfaceContainerLow`         | `#f2f4f6`  | Low elevation container                           |
|                      | `surfaceContainer`            | `#eceef0`  | Default container surface                         |
|                      | `surfaceContainerHigh`        | `#e6e8ea`  | High elevation container                          |
|                      | `surfaceContainerHighest`     | `#e0e3e5`  | Highest elevation container                       |
| **On Surface**       | `onSurface`                   | `#191c1e`  | Text/icons on primary surface                     |
|                      | `onSurfaceVariant`            | `#414755`  | Variant text/icons on primary surface             |
|                      | `inverseSurface`              | `#2d3133`  | Inverse surface for contrast                      |
|                      | `inverseOnSurface`            | `#eff1f3`  | Inverse text/icons for contrast                   |
| **Outline**          | `outline`                     | `#727786`  | Border/divider color                              |
|                      | `outlineVariant`              | `#c1c6d7`  | Lighter border/divider variant                    |
| **Primary (Ocean Blue)**| `primary`                     | `#0058bf`  | Main brand color                                  |
|                      | `onPrimary`                   | `#ffffff`  | Text/icons on primary color (e.g., button text)   |
|                      | `primaryContainer`            | `#006fef`  | Primary container background                      |
|                      | `onPrimaryContainer`          | `#fefcff`  | Text/icons on primary container                   |
|                      | `inversePrimary`              | `#aec6ff`  | Inverse primary color                             |
| **Secondary (Fluid Aqua)**| `secondary`                 | `#00696e`  | Accent color (e.g., "Washing" phase)              |
|                      | `onSecondary`                 | `#ffffff`  | Text/icons on secondary color                     |
|                      | `secondaryContainer`          | `#00f4fe`  | Secondary container background                    |
|                      | `onSecondaryContainer`        | `#006c71`  | Text/icons on secondary container                 |
| **Tertiary (Warm Orange)**| `tertiary`                    | `#894d00`  | Accent color (e.g., "Ironing" phase, UNPAID status) |
|                      | `onTertiary`                  | `#ffffff`  | Text/icons on tertiary color                      |
|                      | `tertiaryContainer`           | `#ac6300`  | Tertiary container background                     |
|                      | `onTertiaryContainer`         | `#fffbff`  | Text/icons on tertiary container                  |
| **Status/Feedback**  | `error`                       | `#ba1a1a`  | Error/destructive actions                         |
|                      | `onError`                     | `#ffffff`  | Text/icons on error background                    |
|                      | `errorContainer`              | `#ffdad6`  | Error container background                        |
|                      | `onErrorContainer`            | `#93000a`  | Text/icons on error container                     |
|                      | `background`                  | `#f7f9fb`  | General background color                          |
|                      | `onBackground`                | `#191c1e`  | Text/icons on general background                  |
|                      | `success`                     | `#34c759`  | Success/completion indicators                     |

### 2. Gradients (`Mobile/constants/theme.ts` - `gradients` export)

Predefined linear gradients for visual accents.

| Name               | Colors               | Description                                           |
| :----------------- | :------------------- | :---------------------------------------------------- |
| `oceanToAqua`      | `['#0077FF', '#00F5FF']` | Primary gradient for pill buttons and hero accents    |
| `loginBackground`  | `['#eaf2ff', '#f7f9fb', '#e6fbff']` | Background gradient for login screen                  |

### 3. Typography (`Mobile/constants/theme.ts` - `typography` export)

Defines font families, sizes, line heights, and letter spacing for consistent text presentation.
-   **Font Families**: Montserrat (headings), Inter (body/labels).
-   **Font Weights**: Bold (`700Bold`), SemiBold (`600SemiBold`), Medium (`500Medium`), Regular (`400Regular`).

| Style           | `fontFamily`              | `fontSize` | `lineHeight` | `letterSpacing` |
| :-------------- | :------------------------ | :--------- | :----------- | :-------------- |
| `headlineXl`    | `Montserrat_700Bold`      | 48         | 56           | -0.4            |
| `headlineLg`    | `Montserrat_700Bold`      | 32         | 40           | -0.2            |
| `headlineLgMobile`| `Montserrat_700Bold`      | 24         | 32           | (none)          |
| `headlineMd`    | `Montserrat_600SemiBold`  | 20         | 28           | (none)          |
| `bodyLg`        | `Inter_400Regular`        | 18         | 28           | (none)          |
| `bodyMd`        | `Inter_400Regular`        | 16         | 24           | (none)          |
| `labelMd`       | `Inter_600SemiBold`       | 14         | 20           | 0.7             |
| `labelSm`       | `Inter_500Medium`         | 12         | 16           | 0.6             |

### 4. Radius (`Mobile/constants/theme.ts` - `radius` export)

Standardized border-radius values for consistent rounded corners.

| Name    | Value (px) | Description                                       |
| :------ | :--------- | :------------------------------------------------ |
| `sm`    | 8          | Small radius (e.g., small buttons, inputs)        |
| `DEFAULT` | 16         | Default radius                                    |
| `md`    | 24         | Medium radius (e.g., cards)                       |
| `lg`    | 32         | Large radius                                      |
| `xl`    | 48         | Extra-large radius                                |
| `full`  | 9999       | Fully rounded (e.g., pill buttons)                |

### 5. Spacing (`Mobile/constants/theme.ts` - `spacing` export)

Defines a consistent spacing scale for margins, paddings, and gaps.

| Name             | Value (px) | Description                                       |
| :--------------- | :--------- | :------------------------------------------------ |
| `unit`           | 8          | Base unit for calculations (e.g., half-unit = 4)  |
| `containerPadding` | 24         | Standard padding for screen containers/cards      |
| `gutter`         | 16         | Standard gutter spacing                           |
| `stackSm`        | 8          | Small vertical/horizontal spacing                 |
| `stackMd`        | 16         | Medium vertical/horizontal spacing                |
| `stackLg`        | 32         | Large vertical/horizontal spacing                 |

## Custom Components Using the Design System

-   **`GlassCard`**: A container component implementing the glassmorphic effect with `BlurView` and a semi-transparent background. It uses `radius.md` for its corners and `colors.primary` for shadow.
-   **`GlassInput`**: Frosted text input fields with icons, designed to fit the glassmorphic aesthetic.
-   **`PillButton`**: Primary action buttons with the `oceanToAqua` gradient and `radius.full` for its pill shape. It uses `colors.onPrimary` for its text.

This structured approach ensures that the LaundriFlow mobile application maintains a cohesive and appealing user interface.
