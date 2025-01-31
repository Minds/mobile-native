import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ChatListItem from './ChatListItem';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');
sp.mockService('i18n');

describe('ChatListItem', () => {
  const mockChat = {
    lastMessageCreatedTimestamp: 1713556235,
    lastMessagePlainText: 'Test message',
    node: {
      roomType: 'ONE_TO_ONE',
      name: 'testuser',
    },
    members: {
      edges: [
        {
          node: {
            iconUrl: 'https://example.com/avatar.jpg',
            username: 'testuser',
          },
        },
      ],
    },
  };

  const mockOnPress = jest.fn();

  it('renders correctly', () => {
    const { getByText } = render(
      <ChatListItem chat={mockChat} onPress={mockOnPress} />,
    );

    expect(getByText('testuser')).toBeTruthy();
    expect(getByText('Test message')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByTestId } = render(
      <ChatListItem chat={mockChat} onPress={mockOnPress} />,
    );

    fireEvent.press(getByTestId('chatListItem'));
    expect(mockOnPress).toHaveBeenCalled();
  });
});
