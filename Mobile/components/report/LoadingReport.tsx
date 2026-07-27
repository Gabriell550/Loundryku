import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { colors, spacing, radius, gradients } from '../../constants/theme';

const SkeletonItem = ({ width, height, borderRadius, style }: any) => {
  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withRepeat(
        withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      ),
      transform: [
        { translateX: offset.value },
      ],
    };
  });

  React.useEffect(() => {
    offset.value = withRepeat(
      withTiming(100, { duration: 1000, easing: Easing.linear }), // Animate 100px to the right
      -1, // Repeat indefinitely
      true // Reverse animation
    );
  }, []);

  return (
    <View style={[styles.skeletonBase, { width, height, borderRadius }, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyles]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.3)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

export default function LoadingReport() {
  return (
    <View style={styles.container}>
      {/* Skeleton Summary Cards */}
      <View style={styles.summaryCardsContainer}>
        {[...Array(4)].map((_, i) => (
          <SkeletonItem
            key={i}
            width={'48%'}
            height={120}
            borderRadius={radius.md}
            style={styles.summaryCardSkeleton}
          />
        ))}
      </View>

      {/* Skeleton Chart */}
      <SkeletonItem
        width={'100%'}
        height={200}
        borderRadius={radius.md}
        style={styles.chartSkeleton}
      />

      {/* Skeleton Transaction Rows */}
      <View style={styles.transactionsHeaderSkeleton}>
        <SkeletonItem width={120} height={20} borderRadius={radius.sm} />
        <SkeletonItem width={80} height={20} borderRadius={radius.sm} />
      </View>
      {[...Array(3)].map((_, i) => (
        <View key={i} style={styles.transactionRowSkeleton}>
          <View>
            <SkeletonItem width={100} height={16} borderRadius={radius.sm} />
            <SkeletonItem width={150} height={16} borderRadius={radius.sm} style={{ marginTop: spacing.unit / 2 }} />
            <SkeletonItem width={80} height={14} borderRadius={radius.sm} style={{ marginTop: spacing.unit / 2 }} />
          </View>
          <View style={styles.transactionBadgesSkeleton}>
            <SkeletonItem width={80} height={20} borderRadius={radius.sm} />
            <SkeletonItem width={80} height={20} borderRadius={radius.sm} style={{ marginTop: spacing.unit / 2 }} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.containerPadding,
    paddingVertical: spacing.stackMd,
  },
  skeletonBase: {
    backgroundColor: colors.surfaceContainer, // A light background for skeleton
    overflow: 'hidden',
  },
  summaryCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.stackLg,
  },
  summaryCardSkeleton: {
    marginBottom: spacing.stackMd,
  },
  chartSkeleton: {
    marginBottom: spacing.stackLg,
  },
  transactionsHeaderSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.stackMd,
  },
  transactionRowSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.stackMd,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  transactionBadgesSkeleton: {
    alignItems: 'flex-end',
  },
});