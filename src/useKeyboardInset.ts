import { useEffect, useRef } from 'react';
import { BackHandler } from 'react-native';
import { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';

/**
 * Bottom padding that follows the on-screen keyboard frame by frame, so content
 * pinned to the bottom rises together with the keyboard instead of jumping.
 * `overlap` is space the content already reserves at the bottom (e.g. the
 * safe-area inset) that the keyboard may cover.
 */
export function useKeyboardInset(overlap = 0) {
  const keyboard = useAnimatedKeyboard({
    isStatusBarTranslucentAndroid: true,
    isNavigationBarTranslucentAndroid: true,
  });
  return useAnimatedStyle(() => ({
    paddingBottom: Math.max(0, keyboard.height.value - overlap),
  }));
}

/**
 * Runs `onBack` for the Android back button while `active`. The most recently
 * activated handler wins, so an overlay opened on top of a screen closes first.
 */
export function useBackHandler(active: boolean, onBack: () => void) {
  // Keep the latest callback without re-registering, which would reorder priority.
  const latest = useRef(onBack);
  useEffect(() => {
    latest.current = onBack;
  });

  useEffect(() => {
    if (!active) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      latest.current();
      return true;
    });
    return () => sub.remove();
  }, [active]);
}
