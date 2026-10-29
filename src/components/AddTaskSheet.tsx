import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';

import { haptic } from '../haptics';
import { quadrantById, type QuadrantId } from '../quadrants';
import { useTheme } from '../theme';
import { QuadrantPicker } from './QuadrantPicker';
import { Sheet } from './Sheet';

type Props = {
  visible: boolean;
  initialQuadrant: QuadrantId;
  onClose: () => void;
  onAdd: (title: string, quadrant: QuadrantId) => void;
};

export function AddTaskSheet({ visible, ...formProps }: Props) {
  return (
    <Sheet visible={visible} onClose={formProps.onClose}>
      {/* Modal only renders children while visible, so the form starts fresh each time. */}
      <AddTaskForm {...formProps} />
    </Sheet>
  );
}

function AddTaskForm({ initialQuadrant, onClose, onAdd }: Omit<Props, 'visible'>) {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [quadrant, setQuadrant] = useState(initialQuadrant);

  const color = quadrantById(quadrant).color;
  const canSubmit = title.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    haptic.success();
    onAdd(title.trim(), quadrant);
    onClose();
  };

  return (
    <>
      <Text style={[styles.heading, { color: theme.text }]}>新任务</Text>
      <TextInput
        autoFocus
        value={title}
        onChangeText={setTitle}
        onSubmitEditing={submit}
        placeholder="要做什么？"
        placeholderTextColor={theme.textTertiary}
        returnKeyType="done"
        submitBehavior="submit"
        selectionColor={color}
        style={[styles.input, { color: theme.text, backgroundColor: theme.surfaceMuted }]}
      />
      <Text style={[styles.label, { color: theme.textSecondary }]}>放进哪个象限</Text>
      <QuadrantPicker value={quadrant} onChange={setQuadrant} />
      <Pressable
        onPress={submit}
        disabled={!canSubmit}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: color, opacity: !canSubmit ? 0.35 : pressed ? 0.85 : 1 },
        ]}
      >
        <Text style={styles.buttonText}>添加</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 14,
  },
  input: {
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 17,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
