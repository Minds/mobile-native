import 'react-native';
import React from 'react';
//import { Platform, CameraRoll, TouchableOpacity } from "react-native";
import ChannelHeader from '../../../src/channel/header/ChannelHeader';
import ChannelStore from '../../../src/channel/ChannelStore';
import userFaker from '../../../__mocks__/fake/channel/UserFactory';
import UserStore from '../../../src/auth/UserStore';
import UserModel from '../../../src/channel/UserModel';
import session from '../../../src/common/services/session.service';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import { getStores } from '../../../AppStores';

jest.mock('../../../src/auth/UserStore');
jest.mock('../../../src/channel/ChannelStore');
jest.mock('../../../src/common/services/boosted-content.service');

const appStores = {
  user: {
    me: {},
    load: jest.fn(),
    setUser: jest.fn(),
  },
};
getStores.mockReturnValue(appStores);

/**
 * Tests
 */
describe('channel header component owner', () => {
  let store, userStore, component;

  const navigation = {
    navigate: jest.fn(),
    state: {
      params: { guid: 1 },
    },
  };

  beforeEach(() => {
    store = new ChannelStore();
    userStore = new UserStore();
    userStore.me = UserModel.create(userFaker('1'));
    navigation.navigate.mockClear();
    appStores.user = userStore;
    session.guid = 1;

    store.channel = UserModel.create(userFaker('1'));
    store.loaded = true;

    component = renderer.create(
      <ChannelHeader.wrappedComponent
        store={store}
        user={userStore}
        navigation={navigation}
        styles={{}}
      />,
    );
  });

  it('should render correctly', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should enable edit, save and disable', async () => {
    const instance = component.getInstance();

    // run onEdit
    await instance.onEditAction();

    expect(instance.state.edit).toBe(true);

    expect(component.root.findAllByType('TextInput').length).toBe(2);

    store.save.mockResolvedValue(true);

    // run again
    await instance.onEditAction();

    expect(instance.state.edit).toBe(false);

    expect(component.root.findAllByType('TextInput').length).toBe(0);
    expect(store.save).toBeCalled();
  });
});
