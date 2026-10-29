import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../theme';
import { useBackHandler, useKeyboardInset } from '../useKeyboardInset';

type Props = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

/**
 * Bottom sheet drawn as an overlay over the current screen (not a Modal, so it
 * shares the app window and can follow the keyboard animation). Appears and
 * disappears instantly; place it last so it covers everything else.
 */
export function Sheet({ visible, onClose, children }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 16) + 8;
  // With the keyboard up, keep a 16pt gap above it instead of the safe-area padding.
  const keyboardStyle = useKeyboardInset(bottomPadding - 16);
  useBackHandler(visible, onClose);

  if (!visible) return null;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.root, keyboardStyle]}>
      <Pressable
        style={[StyleSheet.absoluteFill, { backgroundColor: theme.backdrop }]}
        onPress={onClose}
      />
      <View style={[styles.sheet, { backgroundColor: theme.surface, paddingBottom: bottomPadding }]}>
        <View style={[styles.handle, { backgroundColor: theme.border }]} />
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    marginBottom: 14,
  },
});
