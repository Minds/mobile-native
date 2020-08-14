import 'react-native';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import renderer from 'react-test-renderer';

import ForgotPassword from '../../src/auth/ForgotPassword';
import authService from '../../src/auth/AuthService';
import Button from '../../src/common/components/Button';
import Input from '../../src/common/components/Input';

jest.mock('../../src/auth/AuthService');

// Note: test renderer must be required after react-native.

describe('ForgotPassword component', () => {
  beforeEach(() => {
    authService.forgot.mockClear();
  });

  it('should renders correctly', () => {
    const forgotPassword = renderer.create(<ForgotPassword />).toJSON();
    expect(forgotPassword).toMatchSnapshot();
  });

  it('should calls auth service forgot', async () => {
    authService.forgot.mockReturnValue(Promise.resolve());

    const { getByA11yLabel } = render(<ForgotPassword />);

    const input = getByA11yLabel('usernameInput');
    const button = getByA11yLabel('continueButton');

    await fireEvent.changeText(input, 'myFancyUsername');
    await fireEvent.press(button);

    // expect auth service login to be called once
    expect(authService.forgot).toBeCalled();

    // with username
    expect(authService.forgot.mock.calls[0][0]).toEqual('myFancyUsername');
  });

  it('should calls onBack', async () => {
    const mockFn = jest.fn();

    const { getByA11yLabel } = render(<ForgotPassword onBack={mockFn} />);

    const button = getByA11yLabel('backButton');
    await fireEvent.press(button);

    // expect onLogin to be called once
    expect(mockFn).toBeCalled();
  });
});
