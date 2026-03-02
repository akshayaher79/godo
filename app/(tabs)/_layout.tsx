import { View, StyleSheet } from 'react-native';
import { Text, Icon } from 'react-native-paper';

import { Tabs } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';


const CalendarIconWithDate = () => {
  const today = new Date().getDate();

  return (
    <View style={styles.container}>
      <Icon source="calendar" size={28} color="#555" />
      <Text style={styles.dateText}>{today}</Text>
    </View>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="today"
        options={{
          title: 'Today',
          tabBarIcon: () => <CalendarIconWithDate />,
        }}
      />
      <Tabs.Screen
        name="all_tasks"
        options={{
          title: 'All Tasks',
          tabBarIcon: () => <Icon size={28} source="view-list" />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dateText: {
    position: 'absolute',
    fontSize: 9,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});
