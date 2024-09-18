import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import SupermindOnboarding from './SupermindOnboarding';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');
// mock services
sp.mockService('styles');
sp.mockService('i18n');
sp.mockService('openURL');

describe('SupermindOnboarding', () => {
  test('render consumer onboarding correctly', () => {
    render(<SupermindOnboarding onDismiss={jest.fn()} type="consumer" />);
    expect(screen.toJSON()).toMatchSnapshot();
  });

  test('renders producer onboarding correctly', () => {
    render(<SupermindOnboarding onDismiss={jest.fn()} type="producer" />);
    expect(screen.toJSON()).toMatchSnapshot();
  });

  test('should dismiss', () => {
    const onDismiss = jest.fn();
    render(<SupermindOnboarding onDismiss={onDismiss} type="producer" />);
    fireEvent.press(screen.getByTestId('dismissButton'));

    expect(onDismiss).toHaveBeenCalled();
  });
});
