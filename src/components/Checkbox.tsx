import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { haptic } from '../haptics';

type Props = {
  checked: boolean;
  color: string;
  onToggle: () => void;
};

export function Checkbox({ checked, color, onToggle }: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const press = () => {
    scale.set(withSequence(withTiming(0.75, { duration: 90 }), withSpring(1, { damping: 8, stiffness: 260 })));
    if (checked) haptic.tap();
    else haptic.success();
    onToggle();
  };

  return (
    <Pressable onPress={press} hitSlop={10} accessibilityRole="checkbox" accessibilityState={{ checked }}>
      <Animated.View
        style={[
          styles.box,
          { borderColor: color, backgroundColor: checked ? color : 'transparent' },
          animatedStyle,
        ]}
      >
        {checked && <Ionicons name="checkmark" size={15} color="#FFFFFF" />}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
