import { useEffect, useRef } from 'react';
import { BackHandler } from 'react-native';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import { useAnimatedStyle } from 'react-native-reanimated';

/**
 * Bottom padding that follows the on-screen keyboard frame by frame, so content
 * pinned to the bottom rises together with the keyboard instead of jumping.
 * `overlap` is space the content already reserves at the bottom (e.g. the
 * safe-area inset) that the keyboard may cover. Needs `KeyboardProvider` at the
 * root, which also stops Android from resizing the window underneath.
 */
export function useKeyboardInset(overlap = 0) {
  // `height` is negative while the keyboard is open (it's meant for translateY).
  const { height } = useReanimatedKeyboardAnimation();
  return useAnimatedStyle(() => ({
    paddingBottom: Math.max(0, -height.value - overlap),
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
