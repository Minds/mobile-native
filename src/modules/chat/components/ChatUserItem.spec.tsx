import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ChatUserItem from './ChatUserItem';

describe('ChatUserItem', () => {
  const mockUser = {
    name: 'Test User',
    username: 'testuser',
    getAvatarSource: jest.fn(),
  };

  it('should render correctly', () => {
    const { getByTestId, getByText } = render(
      <ChatUserItem user={mockUser} onPress={jest.fn()} selected={false} />,
    );

    // Check if the component is rendered
    expect(getByTestId('chatUserItem')).toBeTruthy();

    // Check if the user's name and username are displayed correctly
    expect(getByText('Test User')).toBeTruthy();
    expect(getByText('@testuser')).toBeTruthy();
  });

  it('should display the correct avatar when not selected', () => {
    mockUser.getAvatarSource.mockReturnValue('avatar.jpg');

    const { getByTestId } = render(
      <ChatUserItem user={mockUser} onPress={jest.fn()} selected={false} />,
    );

    // Check if the correct avatar is displayed
    // @ts-ignore toHaveProp is not defined on the types
    expect(getByTestId('UserAvatar')).toHaveProp('source', 'avatar.jpg');
  });

  it('should display the check icon when selected', () => {
    const { getByTestId } = render(
      <ChatUserItem user={mockUser} onPress={jest.fn()} selected={true} />,
    );

    // Check if the check icon is displayed
    expect(getByTestId('checkIcon')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const mockOnPress = jest.fn();

    const { getByTestId } = render(
      <ChatUserItem user={mockUser} onPress={mockOnPress} selected={false} />,
    );

    // Simulate a press on the component
    fireEvent.press(getByTestId('chatUserItem'));

    // Check if onPress was called
    expect(mockOnPress).toHaveBeenCalled();
  });
});
