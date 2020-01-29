import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';


import ForgotPassword from '../../src/auth/ForgotPassword';
import authService from '../../src/auth/AuthService';
import Button from '../../src/common/components/Button';
import Input from '../../src/common/components/Input';

jest.mock('../../src/auth/AuthService');

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

describe('ForgotPassword component', () => {
  beforeEach(() => {
    authService.forgot.mockClear();
  });

  it('should renders correctly', () => {
    const forgotPassword = renderer.create(
      <ForgotPassword />
    ).toJSON();
    expect(forgotPassword).toMatchSnapshot();
  });

  it('should calls auth service forgot', async () => {

    authService.forgot.mockReturnValue(Promise.resolve());

    const wrapper = shallow(
      <ForgotPassword />
    );

    // simulate user input
    const render = wrapper.dive();
    render.find(Input).forEach(child => {
      child.simulate('changeText', 'myFancyUsername');
    });

    // press send
    await render.find(Button).at(1).simulate('press');

    // expect auth service login to be called once
    expect(authService.forgot).toBeCalled();

    // with username
    expect(authService.forgot.mock.calls[0][0]).toEqual('myFancyUsername');
  });

  it('should calls onBack', async () => {

    const mockFn = jest.fn();

    const wrapper = shallow(
      <ForgotPassword onBack={mockFn}/>
    );

    const render = wrapper.dive();

    // press go back
    await render.find(Button).at(0).simulate('press');

    // expect onLogin to be called once
    expect(mockFn).toBeCalled();
  });
});
