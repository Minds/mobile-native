import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow, render } from 'enzyme';
import TopbarTabbar from '../../../../src/common/components/topbar-tabbar/TopbarTabbar';
import TopbarTabbarItem from '../../../../src/common/components/topbar-tabbar/TopbarTabbarItem';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const topbarTabbar = renderer.create(<TopbarTabbar></TopbarTabbar>).toJSON();
  expect(topbarTabbar).toMatchSnapshot();
});

it('renders with a tabitem correctly', () => {
  const topbarTabbar = renderer
    .create(
      <TopbarTabbar>
        <TopbarTabbarItem id="first">First Label</TopbarTabbarItem>
      </TopbarTabbar>,
    )
    .toJSON();

  expect(topbarTabbar.children.length).toEqual(1);
  expect(topbarTabbar.children[0]).toBeTruthy();
});
