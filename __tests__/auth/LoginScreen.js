import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';

import LoginScreen from '../../src/auth/LoginScreen';

jest.mock('../../src/auth/AuthService');
jest.mock('../../src/auth/UserStore');

jest.mock('../../src/auth/LoginForm', () => 'LoginForm');
jest.mock('../../src/auth/ForgotPassword', () => 'ForgotPassword');
jest.mock('../../src/common/components/VideoBackground', () => 'VideoBackground');

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import UserStore from '../../src/auth/UserStore';

describe('LoginScreen component', () => {

  it('should renders correctly', () => {
    const userStore = new UserStore();

    const loginScreen = shallow(
      <LoginScreen user={userStore}/>
    );

    expect(loginScreen).toMatchSnapshot();
  });

  it('should shows login form component', async () => {
    const userStore = new UserStore();

    const wrapper = shallow(
      <LoginScreen user={userStore}/>
    );

    // search login form
    let render = wrapper.dive();
    const loginForms = render.find('LoginForm');

    // should contain 1 login form
    expect(loginForms.length).toBe(1);
  });

  it('should shows forgot password component if the user press the button', async () => {
    const userStore = new UserStore();


    const navigation = {
      push: jest.fn()
    };

    const wrapper = shallow(
      <LoginScreen navigation={navigation} user={userStore}/>
    );

    // search login form
    let render = wrapper.dive();
    const loginForms = render.find('LoginForm');

    // should contain 1 login form
    expect(loginForms.length).toBe(1);

    // simulate forgot password component button press
    loginForms.at(0).props().onForgot();

    expect(navigation.push).toBeCalled();
  });
});
