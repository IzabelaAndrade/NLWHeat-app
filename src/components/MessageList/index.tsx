import React from 'react';
import {
  ScrollView,
} from 'react-native';
import { Message } from '../Message';

import { styles } from './styles';

export function MessageList(){

  const DATA = {
    id: '123',
    text: "texto da mensagem",
    user: {
      name: "Izabela Andrade",
      avatar_url: "",
    }
  }
  return (
    <ScrollView style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps='never'
    >
      <Message data={DATA}/>
    </ScrollView>
  );
}