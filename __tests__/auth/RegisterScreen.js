import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';

import RegisterScreen from '../../src/auth/RegisterScreen';

jest.mock('../../src/auth/RegisterForm', () => 'RegisterForm');
jest.mock('../../src/common/components/VideoBackground', () => 'VideoBackground');

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

describe('RegisterScreen component', () => {
  it('should renders correctly', () => {
    const loginScreen = renderer.create(
      <RegisterScreen />
    ).toJSON();
    expect(loginScreen).toMatchSnapshot();
  });

  it('should shows register form component', async () => {
    const wrapper = shallow(
      <RegisterScreen />
    );

    // find register form
    const registerForms = wrapper.find('RegisterForm');

    // should contain 1 login form
    expect(registerForms.length).toBe(1);
  });

  it('should navigate on RegisterForm events', async () => {

    const navigation = {
      dispatch: jest.fn()
    };

    const wrapper = shallow(
      <RegisterScreen navigation={navigation}/>
    );

    // find register form
    const registerForms = wrapper.find('RegisterForm');

    // should contain 1 login form
    expect(registerForms.length).toBe(1);

    // simulate onBack event
    registerForms.at(0).props().onBack();

    // should call navigate
    expect(navigation.dispatch.mock.calls.length).toEqual(1);

    // with a navigation action with route to Login
    expect(navigation.dispatch.mock.calls[0][0].actions[0].routeName).toEqual('Login');
  });
});
