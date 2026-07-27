import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '../../components/ui/GlassCard'; // Assuming GlassCard is in the same directory or adjust path

import { colors, spacing, typography, radius, gradients } from '../../constants/theme';
import { ReportPeriod } from '../../types/report'; // Import ReportPeriod type

interface SegmentControlProps {
  segments: ReportPeriod[]; // Changed from string[] to ReportPeriod[]
  selectedSegment: ReportPeriod; // Changed from string to ReportPeriod
  onSelect: (segment: ReportPeriod) => void; // Changed type of segment
}

export default function SegmentControl({ segments, selectedSegment, onSelect }: SegmentControlProps) {
  return (
    <GlassCard style={styles.container}>
      {segments.map((segment) => { // Removed index as it's not used
        const isSelected = segment === selectedSegment;
        return (
          <TouchableOpacity
            key={segment}
            onPress={() => onSelect(segment)}
            style={styles.segmentButton}
            activeOpacity={0.7}
          >
            {isSelected ? (
              <LinearGradient
                colors={gradients.oceanToAqua}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.selectedSegmentBackground}
              >
                <Text style={styles.selectedSegmentText}>{segment}</Text>
              </LinearGradient>
            ) : (
              <Text style={styles.segmentText}>{segment}</Text>
            )}
          </TouchableOpacity>
        );
      })}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: spacing.stackSm,
    backgroundColor: 'rgba(255,255,255,0.4)', // Lighter background for the control itself
  },
  segmentButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    height: 40,
    overflow: 'hidden', // Ensures gradient is clipped
  },
  selectedSegmentBackground: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
  selectedSegmentText: {
    ...typography.labelMd,
    color: colors.onPrimary,
    fontWeight: 'bold',
  },
  segmentText: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
});
