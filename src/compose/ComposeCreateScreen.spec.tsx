import React from 'react';
import { Keyboard } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import ComposeCreateScreen, {
  pushComposeCreateScreen,
} from './ComposeCreateScreen';
import { pushBottomSheet } from '../common/components/bottom-sheet';

jest.mock('../navigation/NavigationService');
jest.mock('../common/components/bottom-sheet');
const mockOnItemPress = jest.fn();
jest.mock('../common/services/analytics.service');

describe('ComposeCreateScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <ComposeCreateScreen onItemPress={mockOnItemPress} />,
    );

    expect(getByText('Create')).toBeDefined();
    expect(getByText('Post')).toBeDefined();
    expect(getByText('Monetized Post')).toBeDefined();
    expect(getByText('Supermind')).toBeDefined();
    expect(getByText('Long press')).toBeDefined();
    expect(getByText('to skip this menu')).toBeDefined();
  });

  it('calls onItemPress with correct key when menu item is pressed', () => {
    const { getByText } = render(
      <ComposeCreateScreen onItemPress={mockOnItemPress} />,
    );

    fireEvent.press(getByText('Post'));
    expect(mockOnItemPress).toHaveBeenCalledWith('post');

    fireEvent.press(getByText('Monetized Post'));
    expect(mockOnItemPress).toHaveBeenCalledWith('monetizedPost');

    fireEvent.press(getByText('Boosted Post'));
    expect(mockOnItemPress).toHaveBeenCalledWith('boost');
  });
});

describe('pushComposeCreateScreen', () => {
  it('dismisses keyboard and pushes bottom sheet with ComposeCreateScreen', () => {
    Keyboard.dismiss = jest.fn();

    pushComposeCreateScreen();
    expect(Keyboard.dismiss).toHaveBeenCalled();
    expect(pushBottomSheet).toHaveBeenCalledWith(
      expect.objectContaining({ component: expect.any(Function) }),
    );
  });
});
