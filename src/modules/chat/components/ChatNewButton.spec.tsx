import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ChatNewButton from './ChatNewButton';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');
sp.mockService('i18n');

describe('ChatNewButton', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<ChatNewButton testID="chat-new-button" />);
    expect(getByTestId('chat-new-button')).toBeTruthy();
  });

  it('renders the icon', () => {
    const { getByTestId } = render(
      <ChatNewButton testID="chat-new-button-icon" />,
    );
    expect(getByTestId('chat-new-button-icon')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <ChatNewButton onPress={onPressMock} testID="chat-new-button" />,
    );
    fireEvent.press(getByTestId('chat-new-button'));
    expect(onPressMock).toHaveBeenCalled();
  });
});
