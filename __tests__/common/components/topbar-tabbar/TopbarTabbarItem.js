import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow, render } from 'enzyme';
import TopbarTabbarItem from '../../../../src/common/components/topbar-tabbar/TopbarTabbarItem';

// Note: test renderer must be required after react-native.
import renderer, { act } from 'react-test-renderer';

it('renders correctly', () => {
  const topbarTabbar = renderer
    .create(<TopbarTabbarItem id="first">First Label</TopbarTabbarItem>)
    .toJSON();
  expect(topbarTabbar).toMatchSnapshot();
});

it('should have label rendered', () => {
  const topbarTabbarItem = shallow(
    <TopbarTabbarItem id="first">First Label</TopbarTabbarItem>,
  );

  expect(topbarTabbarItem.find(Text).props().children).toMatch('First Label');
});

it('should update our store on press', () => {
  const topbarTabbarItem = shallow(
    <TopbarTabbarItem id="first">First Label</TopbarTabbarItem>,
  );

  act(() => {
    topbarTabbarItem.simulate('press');
  });

  // TODO: figure out how to mock the store properly
});
