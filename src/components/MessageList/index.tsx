import React, { useEffect, useState } from 'react';
import {
  ScrollView,
} from 'react-native';
import io from 'socket.io-client';
import { api } from '../../services/api';
import { Message, MessageProps } from '../Message';

import { styles } from './styles';

const messageQueue: MessageProps[] = [];

const socket = io('http://localhost:4000');

socket.on('new_message', (newMessage: MessageProps) => {
  messageQueue.push(newMessage);
})

export function MessageList(){

  const [currentMessage, setCurrentMessage] = useState<MessageProps[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      if(messageQueue.length > 0) {
        setCurrentMessage(oldValue => [
          messageQueue[0],
          oldValue[0],
          oldValue[1],
        ].filter(Boolean));

        messageQueue.shift()
      }
    }, 3000);

    return () => clearInterval(timer);
  },[])

  useEffect(() => {
    async function fetchmessage() {
      const messageResponse = await api.get<MessageProps[]>('/messages/last3');
      setCurrentMessage(messageResponse.data);
    }
    fetchmessage();
  },[])

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps='never'
    >
      {
        currentMessage.map((message) => {
          return (<Message key={message.id} data={message}/>)
        })
      }
    </ScrollView>
  );
}