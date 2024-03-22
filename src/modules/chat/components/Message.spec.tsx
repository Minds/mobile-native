import * as React from 'react';
import { render, screen } from '@testing-library/react-native';
import Message from './Message';
import sessionService from '~/common/services/session.service';
import { ChatRoomMessagesProvider } from '../contexts/ChatRoomMessageContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChatMessage } from '../types';

jest.mock('~/common/services/session.service');

const mockMessage: ChatMessage = {
  cursor: '',
  node: {
    id: '123',
    guid: '123',
    plainText: 'Hello, World!',
    sender: {
      id: '123',
      node: {
        id: '123',
        guid: '123',
        iconUrl: 'https://example.com',
        username: 'testUser',
        name: 'testUser',
      },
    },
    timeCreatedUnix: '1616161616',
    timeCreatedISO8601: '2021-08-25T19:30:00Z',
  },
};

test('Message renders correctly for other users', () => {
  const queryClient = new QueryClient();

  sessionService.getUser = jest.fn().mockReturnValue({ guid: '456' });

  // @ts-ignore
  render(
    <QueryClientProvider client={queryClient}>
      <ChatRoomMessagesProvider roomGuid="123">
        <Message
          message={mockMessage}
          onLongPress={(message, _) => {
            console.log(message);
          }}
        />
      </ChatRoomMessagesProvider>
      ,
    </QueryClientProvider>,
  );

  expect(screen.getByText('testUser')).toBeTruthy();
  expect(screen.getByText('Hello, World!')).toBeTruthy();
});

test('Message renders correctly for current user', () => {
  const queryClient = new QueryClient();
  sessionService.getUser = jest.fn().mockReturnValue({ guid: '123' });
  // @ts-ignore
  render(
    <QueryClientProvider client={queryClient}>
      <ChatRoomMessagesProvider roomGuid="123">
        <Message
          message={mockMessage}
          onLongPress={(message, _) => {
            console.log(message);
          }}
        />{' '}
      </ChatRoomMessagesProvider>
    </QueryClientProvider>,
  );

  expect(screen.queryByText('testUser')).toBeNull();
  expect(screen.getByText('Hello, World!')).toBeTruthy();
});
