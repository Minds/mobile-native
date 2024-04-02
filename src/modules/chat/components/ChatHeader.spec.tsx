import React from 'react';
import { render, screen } from '@testing-library/react-native';
import ChatHeader from './ChatHeader';
import { ChatRoomRoleEnum, ChatRoomTypeEnum } from '~/graphql/api';
import { ChatRoomProvider } from '../contexts/ChatRoomContext';
import { useChatRoomInfoQuery } from '../hooks/useChatRoomInfoQuery';

jest.mock('../hooks/useChatRoomInfoQuery');

describe('ChatHeader', () => {
  beforeEach(() => {
    const ChatRoomInfoQuery = useChatRoomInfoQuery as jest.MockedFunction<
      typeof useChatRoomInfoQuery
    >;
    ChatRoomInfoQuery.mockReturnValue({
      data: {
        chatRoom: {
          cursor: '',
          totalMembers: 3,
          node: {
            guid: 'testGuid',
            id: 'testId',
            roomType: ChatRoomTypeEnum.OneToOne,
            isChatRequest: false,
            isUserRoomOwner: false,
            areChatRoomNotificationsMuted: false,
          },
          members: {
            edges: [
              {
                node: {
                  iconUrl: 'url1',
                  name: 'John',
                  username: 'u1',
                  guid: '1',
                  id: '1',
                },
                role: ChatRoomRoleEnum.Member,
                cursor: '',
              },
              {
                node: {
                  iconUrl: 'url2',
                  name: 'Martin',
                  username: 'u2',
                  guid: '2',
                  id: '2',
                },
                role: ChatRoomRoleEnum.Member,
                cursor: '',
              },
              {
                node: {
                  iconUrl: 'url3',
                  name: 'Ben',
                  username: 'u3',
                  guid: '3',
                  id: '3',
                },
                role: ChatRoomRoleEnum.Member,
                cursor: '',
              },
            ],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: '',
              endCursor: '',
            },
          },
        },
      },
      isLoading: false,
      isRefetching: false,
      error: null,
      refetch: jest.fn(),
    });
  });
  const members = [
    {
      node: {
        iconUrl: 'url1',
        name: 'John',
        username: 'u1',
        guid: '1',
        id: '1',
      },
      role: ChatRoomRoleEnum.Member,
      cursor: '',
    },
    {
      node: {
        iconUrl: 'url2',
        name: 'Martin',
        username: 'u2',
        guid: '2',
        id: '2',
      },
      role: ChatRoomRoleEnum.Member,
      cursor: '',
    },
    {
      node: {
        iconUrl: 'url3',
        name: 'Ben',
        username: 'u3',
        guid: '3',
        id: '3',
      },
      role: ChatRoomRoleEnum.Member,
      cursor: '',
    },
  ];

  it('renders the title with the first three members', () => {
    render(
      <ChatRoomProvider roomGuid="test-room">
        <ChatHeader members={members} extra={null} />
      </ChatRoomProvider>,
    );

    const title = screen.getByText('John, Martin, Ben');
    expect(title).toBeTruthy();
  });

  it('renders the Avatar component for each member', () => {
    render(
      <ChatRoomProvider roomGuid="test-room">
        <ChatHeader members={members} extra={null} />
      </ChatRoomProvider>,
    );

    const avatarComponents = screen.getAllByTestId('Avatar');
    expect(avatarComponents.length).toBe(members.length);
  });

  it('passes the correct source to the Avatar component', () => {
    render(
      <ChatRoomProvider roomGuid="test-room">
        <ChatHeader members={members} extra={null} />
      </ChatRoomProvider>,
    );

    const avatarComponents = screen.getAllByTestId('Avatar');
    avatarComponents.forEach((avatarComponent, index) => {
      expect(avatarComponent.props.source.uri).toBe(
        members[index].node.iconUrl,
      );
    });
  });
});
