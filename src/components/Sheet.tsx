import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
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
  children: ReactNode;
};

/** Bottom sheet. Appears and disappears instantly, with no transition. */
export function Sheet({ visible, onClose, inline = false, children }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();

  const content = (
    <View style={[styles.root, { paddingBottom: keyboardHeight }]}>
      <Pressable
        style={[StyleSheet.absoluteFill, { backgroundColor: theme.backdrop }]}
        onPress={onClose}
      />
      <View
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
      </View>
    </View>
  );

  if (inline) {
    return visible ? <View style={StyleSheet.absoluteFill}>{content}</View> : null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
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
