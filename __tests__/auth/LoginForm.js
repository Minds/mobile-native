import 'react-native';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import LoginForm from '../../src/auth/LoginForm';
import authService from '../../src/auth/AuthService';
import Input from '../../src/common/components/Input';
import Button from '../../src/common/components/Button';

jest.mock('../../src/auth/AuthService');

describe('LoginForm component', () => {
  beforeEach(() => {
    authService.login.mockClear();
  });

  it('should renders correctly', () => {
    const loginForm = renderer.create(<LoginForm />).toJSON();
    expect(loginForm).toMatchSnapshot();
  });

  it('should calls onLogin when user login', async () => {
    authService.login.mockResolvedValue();

    const { getByTestId, getByA11yLabel } = render(
      <LoginForm />,
    );

    const user = getByTestId('usernameInput');
    const pass = getByTestId('userPasswordInput');
    const button = getByA11yLabel('loginButton');

    await fireEvent.changeText(user, 'myuser');
    await fireEvent.changeText(pass, 'mypass');
    await fireEvent.press(button);

    // expect auth service login to be called once
    expect(authService.login).toBeCalledWith('myuser', 'mypass');
  });
});
