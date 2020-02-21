import 'react-native';
import React from 'react';
import { Alert } from 'react-native';
import { shallow } from 'enzyme';
import MessengerSetup from '../../src/messenger/MessengerSetup';
import MessengerListStore from '../../src/messenger/MessengerListStore';
import UserStore from '../../src/auth/UserStore';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('../../src/messenger/MessengerListStore');
jest.mock('../../src/auth/UserStore');
jest.mock('../../src/common/components/NavNextButton');

Alert.alert = jest.fn();

/**
 * Tests
 */
describe('Messenger setup component', () => {
  let store, userStore, navigation, route;

  beforeEach(() => {
    store = new MessengerListStore();
    userStore = new UserStore();
    navigation = {
      navigate: jest.fn(),
      setOptions: jest.fn(),
    };
    route = {
      params: { guid: 1 },
    };
    Alert.alert.mockClear();
  });

  it('should render correctly for setup', () => {
    const component = renderer
      .create(
        <MessengerSetup.wrappedComponent
          messengerList={store}
          user={userStore}
          navigation={navigation}
          route={route}
        />,
      )
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  it('should render correctly for unlock', () => {
    userStore.me = { chat: true };
    const component = renderer
      .create(
        <MessengerSetup.wrappedComponent
          messengerList={store}
          user={userStore}
          navigation={navigation}
          route={route}
        />,
      )
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  it('should set the password property when input change', () => {
    userStore.me = { chat: false };

    const wrapper = shallow(
      <MessengerSetup.wrappedComponent
        messengerList={store}
        user={userStore}
        navigation={navigation}
        route={route}
      />,
    );

    // simulate user input
    wrapper.find('TextInput').forEach(child => {
      child.simulate('changeText', 'mypass');
    });

    expect(wrapper.instance().password).toEqual('mypass');
    expect(wrapper.instance().confirm).toEqual('mypass');
  });

  it('should warn the user if confirmation not match', () => {
    userStore.me = { chat: false };

    const wrapper = shallow(
      <MessengerSetup.wrappedComponent
        messengerList={store}
        user={userStore}
        navigation={navigation}
        route={route}
      />,
    );

    // simulate user input
    wrapper.find('TextInput').forEach((child, i) => {
      child.simulate('changeText', 'mypass' + i);
    });

    expect(wrapper.instance().password).toEqual('mypass0');
    expect(wrapper.instance().confirm).toEqual('mypass1');

    wrapper.instance().setup();

    expect(Alert.alert).toBeCalledWith('Passwords should match');
  });

  it('should call the method getCrytoKeys of the store with password', async () => {
    userStore.me = { chat: true };

    const onDone = jest.fn();

    const wrapper = shallow(
      <MessengerSetup.wrappedComponent
        messengerList={store}
        user={userStore}
        navigation={navigation}
        route={route}
        onDone={onDone}
      />,
    );

    store.getCryptoKeys.mockResolvedValue(true);

    // simulate user input
    wrapper.find('TextInput').forEach(child => {
      child.simulate('changeText', 'mypass');
    });

    await wrapper.instance().unlock();

    // store should be called
    expect(store.getCryptoKeys).toBeCalledWith('mypass');
    // on done should be called
    expect(onDone).toBeCalled();
  });

  it('should call the method doSetup of the store with password', async () => {
    userStore.me = { chat: false };

    const onDone = jest.fn();

    const wrapper = shallow(
      <MessengerSetup.wrappedComponent
        messengerList={store}
        user={userStore}
        navigation={navigation}
        route={route}
        onDone={onDone}
      />,
    );

    store.doSetup.mockResolvedValue(true);

    // simulate user input
    wrapper.find('TextInput').forEach(child => {
      child.simulate('changeText', 'mypass');
    });

    await wrapper.instance().setup();

    // store should be called
    expect(store.doSetup).toBeCalledWith('mypass');
    // on done should be called
    expect(onDone).toBeCalled();
  });
});
