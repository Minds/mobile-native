import React from 'react';
import { render } from '@testing-library/react-native';
import { useChatRoomMessagesQuery } from '../hooks/useChatRoomMessagesQuery';
import MessageList from './MessageList';
import { ChatMessage } from '../types';
import UserModel from '~/channel/UserModel';
import { ChatRoomProvider } from '../contexts/ChatRoomContext';
import { useChatRoomInfoQuery } from '../hooks/useChatRoomInfoQuery';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');
sp.mockService('i18n');
sp.mockService('permissions');

const sessionService = sp.mockService('session');

jest.mock('../hooks/useChatRoomMessagesQuery');
jest.mock('../hooks/useSetReadReceipt');
jest.mock('../hooks/useChatRoomInfoQuery', () => ({
  useChatRoomInfoQuery: jest.fn(),
}));

const mockedSessionService = sessionService as jest.Mocked<
  typeof sessionService
>;

const mockedUseChatRoomMessagesQuery = useChatRoomMessagesQuery as jest.Mock;
const mockedUseChatRoomInfoQuery = useChatRoomInfoQuery as jest.Mock;

describe('MessageList', () => {
  it('renders without crashing', () => {
    mockedUseChatRoomMessagesQuery.mockReturnValue({
      query: jest.fn(),
      send: jest.fn(),
      messages: [],
      loadNewMessages: jest.fn(),
    });

    render(<MessageList roomGuid="test-room" />);
  });

  it('renders messages', () => {
    mockedSessionService.getUser.mockReturnValue(
      UserModel.create({ guid: '1' }),
    );
    mockedUseChatRoomInfoQuery.mockReturnValue({
      query: jest.fn(),
      send: jest.fn(),
      room: {
        guid: '1',
        id: '1',
        name: 'Test Room',
        description: 'Test Room Description',
        timeCreatedISO8601: '2022-01-01T00:00:00Z',
        timeCreatedUnix: '1640995200',
        timeUpdatedISO8601: '2022-01-01T00:00:00Z',
        timeUpdatedUnix: '1640995200',
        creator: {
          id: '1',
          node: {
            name: 'John Doe',
            iconUrl: 'https://example.com/john-doe.png',
            username: 'john_doe',
            guid: '1',
            id: '1',
          },
        },
        members: {
          edges: [
            {
              cursor: '1',
              node: {
                id: '1',
                node: {
                  name: 'John Doe',
                  iconUrl: 'https://example.com/john-doe.png',
                  username: 'john_doe',
                  guid: '1',
                  id: '1',
                },
              },
            },
          ],
        },
      },
    });
    const mockMessages: ChatMessage[] = [
      {
        cursor: '1',
        node: {
          guid: '1',
          id: '1',
          plainText: 'Hello',
          timeCreatedISO8601: '2022-01-01T00:00:00Z',
          timeCreatedUnix: '1640995200',
          sender: {
            id: '1',
            node: {
              name: 'John Doe',
              iconUrl: 'https://example.com/john-doe.png',
              username: 'john_doe',
              guid: '1',
              id: '1',
            },
          },
        },
      },
      {
        cursor: '2',
        node: {
          guid: '2',
          id: '2',
          plainText: 'Bye',
          timeCreatedISO8601: '2022-01-01T00:00:00Z',
          timeCreatedUnix: '1640995200',
          sender: {
            id: '1',
            node: {
              name: 'John Doe',
              iconUrl: 'https://example.com/john-doe.png',
              username: 'john_doe',
              guid: '1',
              id: '1',
            },
          },
        },
      },
    ];

    mockedUseChatRoomMessagesQuery.mockReturnValue({
      query: jest.fn(),
      send: jest.fn(),
      messages: mockMessages,
      loadNewMessages: jest.fn(),
    });

    const { getByText } = render(
      <ChatRoomProvider roomGuid="1">
        <MessageList roomGuid="test-room" />
      </ChatRoomProvider>,
    );

    mockMessages.forEach(message => {
      expect(getByText(message.node.plainText)).toBeTruthy();
    });
  });
});
