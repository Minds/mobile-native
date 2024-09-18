import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import Button from '~/common/components/Button';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('@gorhom/bottom-sheet');

it('renders correctly', () => {
  const button = renderer.create(<Button text="hello" />).toJSON();
  expect(button).toMatchSnapshot();
});

it('calls onPress as expected when user press', () => {
  const mockFn = jest.fn();

  const button = shallow(<Button text="hello" onPress={mockFn} />);
  // simulate user press
  button.simulate('press');

  // expect fn to be called once
  expect(mockFn).toBeCalled();
});
