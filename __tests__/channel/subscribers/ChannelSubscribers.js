import 'react-native';
import React from 'react';
//import { Platform, CameraRoll, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';
import ChannelSubscribersStore from '../../../src/channel/subscribers/ChannelSubscribersStore';
import ChannelSubscribers from '../../../src/channel/subscribers/ChannelSubscribers';
import userFaker from '../../../__mocks__/fake/channel/UserFactory';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('../../../src/channel/subscribers/ChannelSubscribersStore');
jest.mock('../../../src/discovery/DiscoveryUser', () => 'DiscoveryUser');

/**
 * Tests
 */
describe('channel subscribers component', () => {

  let store;

  const navigation = {
    navigate: jest.fn(),
    state: {
      params: {guid: 1}
    }
  };

  beforeEach(() => {
    store = new ChannelSubscribersStore();
    navigation.navigate.mockClear();
  });

  it('should render correctly', () => {

    store.list.entities = [userFaker('1'), userFaker('2'), userFaker('3')];
    store.list.loaded = true;

    const component = renderer.create(
      <ChannelSubscribers.wrappedComponent channelSubscribersStore={store} navigation={navigation}/>
    ).toJSON();
    expect(component).toMatchSnapshot();
  });

  it('should render correctly without data', () => {
    const component = renderer.create(
      <ChannelSubscribers.wrappedComponent channelSubscribersStore={store} navigation={navigation}/>
    ).toJSON();
    expect(component).toMatchSnapshot();
  });

  it('should filter when the user tap a tab', () => {

    store.list.entities = [userFaker('1'), userFaker('2'), userFaker('3')];
    store.list.loaded = true;

    const wrapper = shallow(
      <ChannelSubscribers.wrappedComponent channelSubscribersStore={store} navigation={navigation}/>
    );

    const render = wrapper.dive();

    // simulate press second tab
    render.find('TouchableHighlight').at(1).simulate('press');
    // simulate press first tab
    render.find('TouchableHighlight').at(0).simulate('press');

    expect(store.setFilter).toBeCalledWith('subscriptions');
    expect(store.setFilter).toBeCalledWith('subscribers');
  });
});