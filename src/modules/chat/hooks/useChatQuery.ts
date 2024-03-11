import { useQuery } from '@tanstack/react-query';
import { ChatMember, ChatMessage } from '../types';
import delay from '~/common/helpers/delay';

type ChatData = {
  messages: Array<ChatMessage>;
  members: Array<ChatMember>;
};

/**
 * Fake data
 */
async function getChat() {
  const data: ChatData = {
    members: [
      {
        guid: '1',
        username: 'John',
        avatar: 'https://cdn.minds.com/icon/100000000000000134/small',
      },
      {
        guid: '2',
        username: 'Bill',
        avatar:
          'https://cdn.minds.com/icon/100000000000000341/medium/1709275052',
      },
      {
        guid: '822461769950699526',
        username: 'Martin',
        avatar:
          'https://cdn.minds.com/icon/773311697292107790/large/1597789367',
      },
    ],
    messages: [
      {
        id: '1',
        plainText: 'Hello',
        sender: {
          username: 'John',
          guid: '1',
        },
        timeCreatedISO8601: '2021-08-25T19:30:00Z',
        timeCreatedUnix: '1629907800',
      },
      {
        id: '2',
        plainText:
          'Hello, there! This is a loooooonger message and it should be contained correctly or I will be MAAAAAAAAD!',
        sender: {
          username: 'Martin',
          guid: '822461769950699526',
        },
        timeCreatedISO8601: '2021-08-25T19:31:00Z',
        timeCreatedUnix: '1629907860',
      },
      {
        id: '3',
        plainText: 'Test 1',
        sender: {
          username: 'John',
          guid: '1',
        },
        timeCreatedISO8601: '2021-08-25T19:30:00Z',
        timeCreatedUnix: '1629907800',
      },
      {
        id: '4',
        plainText: 'Test 2',
        sender: {
          username: 'John',
          guid: '1',
        },
        timeCreatedISO8601: '2021-08-25T19:30:00Z',
        timeCreatedUnix: '1629907800',
      },
      {
        id: '5',
        plainText: 'TEst 3',
        sender: {
          username: 'John',
          guid: '1',
        },
        timeCreatedISO8601: '2021-08-25T19:30:00Z',
        timeCreatedUnix: '1709415620',
      },
      {
        id: '6',
        plainText:
          'Hello, there! This is a loooooonger message and it should be contained correctly or I will be MAAAAAAAAD!',
        sender: {
          username: 'John',
          guid: '1',
        },
        timeCreatedISO8601: '2023-03-04T15:31:00Z',
        timeCreatedUnix: '1709577620',
      },
    ],
  };
  await delay(1000);
  return data;
}

export function useChatQuery(id: string) {
  return useQuery(['chat', id], getChat, {
    staleTime: 0,
    cacheTime: 5 * 60 * 1000,
  });
}
