import 'react-native';
import React from 'react';
import { Alert } from "react-native";
import { shallow } from 'enzyme';

import RegisterFormNew from '../../src/auth/RegisterFormNew';
import authService from '../../src/auth/AuthService';

jest.mock('../../src/auth/AuthService');
jest.mock('../../src/auth/UserStore');

Alert.alert = jest.fn();

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import UserStore from '../../src/auth/UserStore';

describe('RegisterFormNew component', () => {
  beforeEach(() => {
    authService.register.mockClear();
    Alert.alert.mockClear();
  });

  it('should renders correctly', () => {
    const userStore = new UserStore();
    const registerForm = renderer.create(
      <RegisterFormNew user={userStore}/>
    ).toJSON();
    expect(registerForm).toMatchSnapshot();
  });

  it('should call auth services register', async () => {

    authService.register.mockResolvedValue();

    const userStore = new UserStore();

    const wrapper = shallow(
      <RegisterFormNew user={userStore}/>
    );

    const render = wrapper.dive();

    // find the text inputs
    let inputs = render.find('TextInput');

    // should have 4 inputs
    expect(inputs.length).toBe(3);

    // simulate user input
    inputs.at(0).simulate('changeText', 'myFancyUsername');
    inputs.at(1).simulate('changeText', 'my@mail.com');
    inputs.at(2).simulate('changeText', 'somepassword');

    // simulate press checkbox
    await render.find('CheckBox').at(0).simulate('press');

    // update component (password confirmation is shown after the password field is set)
    await wrapper.update();

    // update the inputs search
    inputs = render.find('TextInput');

    // simulate user input for paddword confirmation
    inputs.at(3).simulate('changeText', 'somepassword');

    // simulate press register
    await render.find('Button').at(0).simulate('press');

    // expect auth service register to be called once
    expect(authService.register).toBeCalled();
  });

  it('should warn the user if the password confirmation is different', async () => {
    const userStore = new UserStore();

    const wrapper = shallow(
      <RegisterFormNew user={userStore}/>
    );

    const render = wrapper.dive();

    // find the text inputs
    let inputs = render.find('TextInput');

    // should have 4 inputs
    expect(inputs.length).toBe(3);

    // simulate user input
    inputs.at(0).simulate('changeText', 'myFancyUsername');
    inputs.at(1).simulate('changeText', 'my@mail.com');
    inputs.at(2).simulate('changeText', 'somepassword');
    // update component (password confirmation is shown after the password field is set)
    await wrapper.update();

    // update the inputs search
    inputs = render.find('TextInput');

    // simulate user input for paddword confirmation
    inputs.at(3).simulate('changeText', 'ohNoItIsDifferent');

    // simulate press register
    await render.find('Button').at(0).simulate('press');

    // should call alert
    expect(Alert.alert).toBeCalled();

    // with error message
    expect(Alert.alert.mock.calls[0][1]).toEqual('You should accept the terms and conditions');
  });

  it('should warn the user if the terms and conditions are not accepted', async () => {
    const userStore = new UserStore();

    const wrapper = shallow(
      <RegisterFormNew user={userStore}/>
    );

    const render = wrapper.dive();

    // find the text inputs
    let inputs = render.find('TextInput');

    // should have 4 inputs
    expect(inputs.length).toBe(3);

    // simulate user input
    inputs.at(0).simulate('changeText', 'myFancyUsername');
    inputs.at(1).simulate('changeText', 'my@mail.com');
    inputs.at(2).simulate('changeText', 'somepassword');
    // update component (password confirmation is shown after the password field is set)
    await wrapper.update();

    // update the inputs search
    inputs = render.find('TextInput');

    // simulate user input for paddword confirmation
    inputs.at(3).simulate('changeText', 'somepassword');

    // simulate press register
    await render.find('Button').at(0).simulate('press');

    // should call alert
    expect(Alert.alert).toBeCalled();

    // with error message
    expect(Alert.alert.mock.calls[0][1]).toEqual('You should accept the terms and conditions');
  });
});
