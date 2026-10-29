import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../theme';
import { useKeyboardHeight } from '../useKeyboardHeight';

type Props = {
  visible: boolean;
  onClose: () => void;
  /**
   * Render as an overlay inside the current screen instead of a new Modal.
   * Use it when the caller is already inside a Modal: Android lays out a Modal
   * opened from another Modal short of the bottom edge.
   */
  inline?: boolean;
  /** Slide/fade in. Off shows the sheet instantly. */
  animated?: boolean;
  children: ReactNode;
};

export function Sheet({ visible, onClose, inline = false, animated = true, children }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();

  const content = (
    <View style={[styles.root, { paddingBottom: keyboardHeight }]}>
      <Animated.View
        entering={inline ? FadeIn.duration(180) : undefined}
        exiting={inline ? FadeOut.duration(160) : undefined}
        style={[StyleSheet.absoluteFill, { backgroundColor: theme.backdrop }]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      <Animated.View
        entering={animated ? SlideInDown.springify().damping(22).stiffness(220) : undefined}
        exiting={inline ? SlideOutDown.duration(200) : undefined}
        style={[
          styles.sheet,
          {
            backgroundColor: theme.surface,
            paddingBottom: keyboardHeight ? 16 : Math.max(insets.bottom, 16) + 8,
          },
        ]}
      >
        <View style={[styles.handle, { backgroundColor: theme.border }]} />
        {children}
      </Animated.View>
    </View>
  );

  if (inline) {
    return visible ? <View style={StyleSheet.absoluteFill}>{content}</View> : null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType={animated ? 'fade' : 'none'}
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      {content}
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
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
