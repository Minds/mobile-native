import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';

import RegisterScreenNew from '../../src/auth/RegisterScreenNew';

jest.mock('../../src/auth/RegisterFormNew', () => 'RegisterFormNew');
jest.mock('../../src/common/components/VideoBackground', () => 'VideoBackground');

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

describe('RegisterScreenNew component', () => {
  it('should renders correctly', () => {
    const loginScreen = renderer.create(
      <RegisterScreenNew />
    ).toJSON();
    expect(loginScreen).toMatchSnapshot();
  });

  it('should shows register form component', async () => {
    const wrapper = shallow(
      <RegisterScreenNew />
    );

    // find register form
    const registerForms = wrapper.find('RegisterFormNew');

    // should contain 1 login form
    expect(registerForms.length).toBe(1);
  });

  it('should navigate on RegisterFormNew events', async () => {

    const navigation = {
      dispatch: jest.fn(),
      navigate: jest.fn(),
    };

    const wrapper = shallow(
      <RegisterScreenNew navigation={navigation}/>
    );

    // find register form
    const registerForms = wrapper.find('RegisterFormNew');

    // should contain 1 login form
    expect(registerForms.length).toBe(1);

    // simulate onBack event
    registerForms.at(0).props().onBack();

    // with a navigation action with route to Login
    expect(navigation.navigate).toBeCalledWith('Login');
  });
});
