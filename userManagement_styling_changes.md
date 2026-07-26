# Styling Changes to `Mobile/app/(tabs)/userManagement.tsx`

This document outlines the modifications made to the `UserManagement.tsx` component to align its styling with the LaundriFlow design system defined in `theme.ts` and ensure correct prop usage for `GlassCard` and `PillButton` components.

## Summary of Changes

The primary goal was to refactor the component's inline styles and component prop usage to leverage the predefined design tokens (`colors`, `spacing`, `typography`, `radius`) for consistency and maintainability.

### 1. Import Statements

-   `TouchableOpacity` was removed from `react-native` imports as custom `PillButton` components are used for actions.
-   `radius` was explicitly added to the import from `../../constants/theme`.
-   `Table` and `Row` from `react-native-table-component` were commented out, indicating a shift to a custom table rendering approach.

### 2. Component Usage Updates

-   **`GlassCard`**:
    -   The `style` prop was correctly used as `style={styles.card}`, consistent with the `GlassCard` component's definition.
-   **`PillButton`**:
    -   `PillButton` components for "Edit" and "Hapus" actions were updated to use `containerStyle={styles.editButton}` and `containerStyle={styles.deleteButton}` respectively, and `textStyle={styles.buttonText}`. This correctly passes the styling to the internal components of `PillButton`.
    -   Reverted the linter/user's change from `PillButton` to `TouchableOpacity` back to `PillButton`.

### 3. Stylesheet (`styles`) Object Refinements

All style properties within `StyleSheet.create` were updated to use values from the imported `colors`, `spacing`, `typography`, and `radius` constants.

-   **`safeArea`**:
    -   `backgroundColor`: `colors.surface`
-   **`card`**:
    -   `margin`: `spacing.containerPadding`
    -   `padding`: `spacing.containerPadding` (Mapped from previous assumed `cardPadding`)
    -   `backgroundColor`: `rgba(255,255,255,0.7)` (maintained glassmorphic effect)
-   **`title`**:
    -   `fontFamily`, `fontSize`, `lineHeight`: Spread from `typography.headlineMd`
    -   `color`: `colors.onSurface`
    -   `marginBottom`: `spacing.stackMd`
-   **`tableContainer`**:
    -   `borderRadius`: `radius.md` (Mapped from previous `spacing.borderRadius`)
-   **`tableHeader`**:
    -   `backgroundColor`: `colors.primary`
    -   `paddingVertical`: `spacing.stackSm` (Mapped from previous `spacing.sm`)
-   **`tableHeaderText`**:
    -   `fontFamily`, `fontSize`, `lineHeight`, `letterSpacing`: Spread from `typography.labelMd`
    -   `color`: `colors.onPrimary` (Mapped from previous `colors.white`)
-   **`tableRow`**:
    -   `paddingVertical`: `spacing.stackSm` (Mapped from previous `spacing.sm`)
-   **`tableCell`**:
    -   `fontFamily`, `fontSize`, `lineHeight`: Spread from `typography.bodyMd` (Mapped from previous `typography.bodySm`)
    -   `color`: `colors.onSurface`
-   **`actionButtons`**:
    -   `gap`: `spacing.unit` (Mapped from previous `spacing.sm`)
    -   Explicit `flex` removed from style object, as it is overridden in JSX.
-   **`editButton` / `deleteButton`**:
    -   `height`: `30`
    -   `flex`: `1` (Mapped from previous `width: 60` to allow flexible sizing within `actionButtons`)
    -   `backgroundColor`: `colors.success` (edit) / `colors.error` (delete)
    -   `paddingVertical`: `spacing.unit / 2` (Mapped from previous `spacing.xxs`)
    -   `paddingHorizontal`: `spacing.unit` (Mapped from previous `spacing.xs`)
    -   `borderRadius`: `radius.sm` (Mapped from previous `spacing.borderRadiusSm`)
    -   `justifyContent`, `alignItems`: Set to `'center'` for proper text alignment.
-   **`buttonText`**:
    -   `fontFamily`, `fontSize`, `lineHeight`, `letterSpacing`: Spread from `typography.labelSm`
    -   `color`: `colors.onPrimary` (Mapped from previous `colors.white`)
    -   `fontSize`: `10` (explicitly set for smaller buttons).

These changes collectively enhance the component's adherence to the defined design system, making it more consistent, scalable, and easier to maintain.