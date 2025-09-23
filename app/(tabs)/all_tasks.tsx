import { Text } from 'react-native';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '@/styles/common';

export default function AllTasksList() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <Text>Work in progress</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
