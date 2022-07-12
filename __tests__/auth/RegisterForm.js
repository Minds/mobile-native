import { NativeModules } from 'react-native';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
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
jest.mock('@gorhom/bottom-sheet');

describe('RegisterScreen component', () => {
  let navigation;
  beforeEach(() => {
    navigation = { goBack: jest.fn() };
    useNavigation.mockReturnValue(navigation);
    authService.register.mockClear();
    showNotification.mockClear();
  });

  it('should require terms', async () => {
    const { getByTestId } = render(<RegisterForm />);
    const user = getByTestId('usernameRegisterInput');
    const email = getByTestId('emailInput');
    const password = getByTestId('passwordInput');
    const button = getByTestId('registerButton');

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
    const { getByTestId, getAllByA11yRole } = render(<RegisterForm />);
    const user = getByTestId('usernameRegisterInput');
    const email = getByTestId('emailInput');
    const password = getByTestId('passwordInput');
    const checkboxes = getAllByA11yRole('checkbox');
    const button = getByTestId('registerButton');

    await fireEvent.changeText(user, 'myuser');
    await fireEvent.changeText(email, 'myuser@minds.com');
    await fireEvent.changeText(password, 'Temp');

    await fireEvent.press(checkboxes[0]);

    await fireEvent.press(button);

    expect(showNotification).toBeCalledWith(
      'Password must match the criteria',
      'info',
      2500,
    );
  });

  it('should call show captcha and auth service', async () => {
    const { getByTestId, getAllByA11yRole } = render(<RegisterForm />);
    const user = getByTestId('usernameRegisterInput');
    const email = getByTestId('emailInput');
    const password = getByTestId('passwordInput');
    const checkboxes = getAllByA11yRole('checkbox');
    const button = getByTestId('registerButton');

    // const spy = jest.spyOn(captcha.parent, 'show');

    await fireEvent.changeText(user, 'myuser');
    await fireEvent.changeText(email, 'myuser@minds.com');
    await fireEvent.changeText(password, 'Temp!1234');

    await fireEvent.press(checkboxes[0]);

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
