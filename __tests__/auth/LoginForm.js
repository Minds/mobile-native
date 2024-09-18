import { Animated, LayoutAnimation } from 'react-native';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import LoginForm from '~/auth/login/LoginForm';
import { getStores } from '../../AppStores';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');
sp.mockService('session');
sp.mockService('i18n');
const authService = sp.mockService('auth');

jest.mock('@gorhom/bottom-sheet');
jest.mock('react-native-modern-datepicker', () => ({}));

getStores.mockReturnValue({
  user: {
    me: {},
    load: jest.fn().mockReturnValue({ guid: '1' }),
    setUser: jest.fn(),
  },
});

//TODO: remove after refactor button component
Animated.timing = jest.fn().mockReturnValue({ start: jest.fn() });
Animated.spring = jest.fn().mockReturnValue({ start: jest.fn() });
LayoutAnimation.configureNext = jest.fn();

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

    const { getByTestId, getByA11yLabel } = render(<LoginForm />);

    const user = getByTestId('usernameLoginInput');
    const pass = getByTestId('userPasswordInput');
    const button = getByTestId('loginButton');

    await fireEvent.changeText(user, 'myuser');
    await fireEvent.changeText(pass, 'mypass');
    await fireEvent.press(button);

    // expect auth service login to be called once
    expect(authService.login).toBeCalledWith('myuser', 'mypass');
  });
});
