import { Animated, NativeModules, LayoutAnimation } from 'react-native';
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import RegisterForm from '../../src/auth/register/RegisterForm';
import authService from '../../src/auth/AuthService';
import { showNotification } from '../../AppMessages';
import { useNavigation } from '@react-navigation/core';

NativeModules.Networking.clearCookies = jest.fn();
jest.mock('@react-navigation/core');
jest.mock('../../src/auth/AuthService');
jest.mock('../../src/auth/UserStore');
jest.mock('../../src/common/components/Captcha');
jest.mock('react-native-safe-area-context');
jest.mock('../../AppMessages', () => ({ showNotification: jest.fn() }));

//TODO: remove after refactor button component
Animated.timing = jest.fn().mockReturnValue({ start: jest.fn() });
Animated.spring = jest.fn().mockReturnValue({ start: jest.fn() });
LayoutAnimation.configureNext = jest.fn();

describe('RegisterScreen component', () => {
  let navigation;
  beforeEach(() => {
    navigation = { goBack: jest.fn() };
    useNavigation.mockReturnValue(navigation);
    authService.register.mockClear();
    showNotification.mockClear();
  });

  it('should require terms', async () => {
    render(<RegisterForm />);
    const user = screen.getByTestId('usernameRegisterInput');
    const email = screen.getByTestId('emailInput');
    const password = screen.getByTestId('passwordInput');
    const button = screen.getByTestId('registerButton');

    await fireEvent.changeText(user, 'myuser');
    await fireEvent.changeText(email, 'myuser@minds.com');
    await fireEvent.changeText(password, 'Temp!2');

    await fireEvent.press(button);

    expect(showNotification).toBeCalledWith(
      'You should accept the terms and conditions',
      'info',
      3000,
    );
  });

  it('should validate password', async () => {
    render(<RegisterForm />);
    const user = screen.getByTestId('usernameRegisterInput');
    const email = screen.getByTestId('emailInput');
    const password = screen.getByTestId('passwordInput');
    const checkboxes = screen.getAllByTestId('checkbox');
    const button = screen.getByTestId('registerButton');

    await fireEvent.changeText(user, 'myuser');
    await fireEvent.changeText(email, 'myuser@minds.com');
    await fireEvent.changeText(password, 'Temp');

    await fireEvent.press(checkboxes[0]);
    await fireEvent.press(checkboxes[1]);

    await fireEvent.press(button);

    expect(showNotification).toBeCalledWith(
      'Password must match the criteria',
      'info',
      2500,
    );
  });

  it('should call show captcha and auth service', async () => {
    render(<RegisterForm />);
    const user = screen.getByTestId('usernameRegisterInput');
    const email = screen.getByTestId('emailInput');
    const password = screen.getByTestId('passwordInput');
    const checkboxes = screen.getAllByTestId('checkbox');
    const button = screen.getByTestId('registerButton');

    // const spy = jest.spyOn(captcha.parent, 'show');

    await fireEvent.changeText(user, 'myuser');
    await fireEvent.changeText(email, 'myuser@minds.com');
    await fireEvent.changeText(password, 'Temp!1234');

    await fireEvent.press(checkboxes[0]);
    await fireEvent.press(checkboxes[1]);

    await fireEvent.press(button);

    expect(authService.register).toBeCalledWith({
      captcha: '{"jwtToken":"FAFA","clientText":"some45"}',
      email: 'myuser@minds.com',
      exclusive_promotions: true,
      password: 'Temp!1234',
      username: 'myuser',
    });
  });
});
