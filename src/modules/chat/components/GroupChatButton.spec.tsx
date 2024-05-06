import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import GroupChatButton from './GroupChatButton';
import { useCreateGroupChatRoom } from '../hooks/useCreateGroupChatRoom';
import GroupModel from '~/groups/GroupModel';

jest.mock('../hooks/useCreateGroupChatRoom');

describe('GroupChatButton', () => {
  const mockCreateChatRoom = jest.fn();
  const mockGroup = GroupModel.create({ guid: '123' });

  beforeEach(() => {
    jest.clearAllMocks();
    (useCreateGroupChatRoom as jest.Mock).mockReturnValue({
      createChatRoom: mockCreateChatRoom,
      isLoading: false,
    });
  });

  it('renders null if conversation is disabled and user is not the owner', () => {
    mockGroup.conversationDisabled = true;
    mockGroup.isOwner = jest.fn().mockReturnValue(false);
    const { toJSON } = render(<GroupChatButton group={mockGroup} />);
    expect(toJSON()).toBeNull();
  });

  it('renders the button if conversation is not disabled or user is the owner', () => {
    mockGroup.conversationDisabled = false;
    mockGroup.isOwner = jest.fn().mockReturnValue(true);
    const { getByTestId } = render(<GroupChatButton group={mockGroup} />);
    expect(getByTestId('createChat')).toBeTruthy();
  });

  it('calls createChatRoom when button is pressed', () => {
    mockGroup.conversationDisabled = false;
    mockGroup.isOwner = jest.fn().mockReturnValue(true);
    const { getByTestId } = render(<GroupChatButton group={mockGroup} />);
    fireEvent.press(getByTestId('createChat'));
    expect(mockCreateChatRoom).toHaveBeenCalled();
  });

  it('disables the button when isLoading is true', () => {
    (useCreateGroupChatRoom as jest.Mock).mockReturnValue({
      createChatRoom: mockCreateChatRoom,
      isLoading: true,
    });
    mockGroup.conversationDisabled = false;
    mockGroup.isOwner = jest.fn().mockReturnValue(true);
    const { getByTestId } = render(<GroupChatButton group={mockGroup} />);
    expect(getByTestId('createChat').props.disabled).toBe(true);
  });
});
