import { StatusBar } from 'expo-status-bar';
import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import { StyleSheet } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppStateProvider } from '../AppState';
import { AddTaskSheet } from '../components/AddTaskSheet';
import { QuadrantScreen } from '../components/QuadrantScreen';
import { TabBar } from '../components/TabBar';
import { TaskActionsSheet } from '../components/TaskActionsSheet';
import { useTheme } from '../theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <KeyboardProvider statusBarTranslucent navigationBarTranslucent preserveEdgeToEdge>
        <AppStateProvider>
          <Shell />
        </AppStateProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}

function Shell() {
  const theme = useTheme();
  return (
    <Tabs style={[styles.root, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <TabSlot />
      {/* Declares the routes; the visible buttons live in TabBar. */}
      <TabList style={styles.hidden}>
        <TabTrigger name="index" href="/" />
        <TabTrigger name="calendar" href="/calendar" />
      </TabList>
      <TabBar />

      {/* Overlays above both tabs and the bar, topmost last. */}
      <QuadrantScreen />
      <AddTaskSheet />
      <TaskActionsSheet />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  hidden: {
    display: 'none',
  },
});
