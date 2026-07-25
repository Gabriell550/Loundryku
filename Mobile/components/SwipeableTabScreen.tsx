import React, { ReactNode, useRef, useEffect } from 'react';
import { Dimensions, Animated, PanResponder } from 'react-native';
import { useNavigation } from 'expo-router';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

const SCREEN_WIDTH = Dimensions.get('window').width;

const TAB_NAMES = ['index', 'orders', 'customers', 'profile'] as const;

interface Props {
  children: ReactNode;
  index: number;
}

export default function SwipeableTabScreen({ children, index }: Props) {
  const translateX = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);
  const navigation = useNavigation<BottomTabNavigationProp<any>>();

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      isAnimating.current = false;
      translateX.setValue(0);
    });
    return unsub;
  }, [navigation]);

  const navigateTo = (toIndex: number) => {
    navigation.navigate(TAB_NAMES[toIndex]);
    isAnimating.current = false;
    translateX.setValue(0);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponderCapture: () => false,
    onMoveShouldSetPanResponderCapture: (_, g) => {
      return Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy);
    },
    onPanResponderGrant: () => {
      if (isAnimating.current) return;
      translateX.setValue(0);
    },
    onPanResponderMove: (_, g) => {
      if (isAnimating.current) return;
      translateX.setValue(g.dx * 0.5);
    },
    onPanResponderRelease: (_, g) => {
      if (isAnimating.current) return;
      const threshold = SCREEN_WIDTH * 0.2;
      if (g.dx < -threshold && index < TAB_NAMES.length - 1) {
        isAnimating.current = true;
        translateX.setValue(g.dx * 0.5);
        Animated.timing(translateX, {
          toValue: -SCREEN_WIDTH,
          duration: 150,
          useNativeDriver: true,
        }).start(() => navigateTo(index + 1));
      } else if (g.dx > threshold && index > 0) {
        isAnimating.current = true;
        translateX.setValue(g.dx * 0.5);
        Animated.timing(translateX, {
          toValue: SCREEN_WIDTH,
          duration: 150,
          useNativeDriver: true,
        }).start(() => navigateTo(index - 1));
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          damping: 25,
          stiffness: 250,
        }).start();
      }
    },
    onPanResponderTerminate: () => {
      if (!isAnimating.current) {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  return (
    <Animated.View
      style={[{ flex: 1, transform: [{ translateX }] }]}
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
  );
}
