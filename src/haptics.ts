import * as Haptics from 'expo-haptics';

// Haptics are a nicety: never let a missing vibrator (or the web) throw.
const safe = (p: Promise<void>) => p.catch(() => {});

export const haptic = {
  select: () => safe(Haptics.selectionAsync()),
  tap: () => safe(Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  success: () => safe(Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  warn: () => safe(Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
};
