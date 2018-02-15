import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';
import Button from '../../../src/common/components/Button';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const button = renderer.create(
    <Button text="hello"/>
  ).toJSON();
  expect(button).toMatchSnapshot();
});

it('calls onPress as expected when user press', () => {

  const mockFn = jest.fn();

  const button = shallow(
    <Button text="hello" onPress={mockFn}/>
  );
  // simulate user press
  button.simulate('press');

  // expect fn to be called once
  expect(mockFn).toBeCalled();
});
