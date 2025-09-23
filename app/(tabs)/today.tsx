import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

import { List, PaperProvider } from 'react-native-paper';


import AgendaSection from '@/components/AgendaSection';
import { InputModalProvider } from '@/components/InputModalProvider';

import { styles } from '@/styles/common';


export default function Agenda() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <PaperProvider>
          <InputModalProvider>
            <List.AccordionGroup>
              {[0, 1, 2, 3, 4].map(sectionIndex => (
                <AgendaSection key={sectionIndex} sectionIndex={sectionIndex} />
              ))}
            </List.AccordionGroup>
          </InputModalProvider>
        </PaperProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
