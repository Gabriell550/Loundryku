import React, { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_W = Dimensions.get('window').width;

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastConfig {
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onPress?: () => void;
}

type ShowFn = (config: ToastConfig) => void;

const ICON_MAP: Record<ToastType, { name: keyof typeof Ionicons.glyphMap; color: string; bg: string }> = {
  success: { name: 'checkmark-circle', color: '#ffffff', bg: '#34C759' },
  error: { name: 'close-circle', color: '#ffffff', bg: '#FF3B30' },
  warning: { name: 'alert-circle', color: '#ffffff', bg: '#FF9500' },
  info: { name: 'information-circle', color: '#ffffff', bg: '#007AFF' },
};

let globalShow: ShowFn = () => {};

export function toast(config: ToastConfig) {
  globalShow(config);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<ToastConfig>({ type: 'success', message: '' });
  const anim = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((cfg: ToastConfig) => {
    if (timer.current) clearTimeout(timer.current);
    setConfig(cfg);
    setVisible(true);
    anim.setValue(0);
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 14,
      stiffness: 180,
    }).start();
    timer.current = setTimeout(() => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }, cfg.duration || 2500);
  }, [anim]);

  useEffect(() => {
    globalShow = show;
  }, [show]);

  const hide = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    Animated.timing(anim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  }, [anim]);

  const icon = ICON_MAP[config.type];

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 0],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 1, 1],
  });

  return (
    <>
      {children}
      {visible && (
        <Animated.View
          style={[
            styles.container,
            { transform: [{ translateY }], opacity },
          ]}
          pointerEvents="box-none"
        >
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => { hide(); config.onPress?.(); }}
            style={[styles.toast, { backgroundColor: icon.bg }]}
          >
            <View style={styles.iconRow}>
              <Ionicons name={icon.name} size={24} color={icon.color} />
            </View>
            <View style={styles.textWrap}>
              {config.title && <Text style={styles.title}>{config.title}</Text>}
              <Text style={styles.message}>{config.message}</Text>
            </View>
            <TouchableOpacity onPress={hide} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={18} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  iconRow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textWrap: { flex: 1 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 14, color: '#ffffff', marginBottom: 2 },
  message: { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.95)', lineHeight: 18 },
});
