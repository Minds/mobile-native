import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ChatListItem from './ChatListItem';

describe('ChatListItem', () => {
  const mockChat = {
    node: {
      roomType: 'ONE_TO_ONE',
      timeCreatedISO8601: new Date().toISOString(),
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
    messages: {
      edges: [
        {
          node: {
            plainText: 'Test message',
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
