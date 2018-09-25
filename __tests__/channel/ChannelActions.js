import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';
import ChannelActions from '../../src/channel/ChannelActions';
import UserModel from '../../src/channel/UserModel';
import userFaker from '../../__mocks__/fake/channel/UserFactory'
import ChannelStore from '../../src/channel/ChannelStore';
import features from '../../src/common/services/features.service';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('../../src/channel/ChannelStore');
jest.mock('../../src/channel/UserModel');
jest.mock('../../src/common/services/features.service');
jest.mock('../../AppStores');

/**
 * Tests
 */
describe('channel actions component', () => {
  beforeEach(() => {
    store = new ChannelStore();
    store.channel = new UserModel(userFaker(1));
  });

  it('should renders correctly', () => {

    // return true to has crypto
    features.has.mockReturnValue(true);

    const component = renderer.create(
      <ChannelActions channel={store} />
    ).toJSON();

    expect(component).toMatchSnapshot();
  });

  it('should show the correct options', () => {

    const wrapper = shallow(
      <ChannelActions channel={store} />
    );

    let opt = wrapper.instance().getOptions();

    expect(opt).toEqual([ 'Cancel', 'Block', 'Report' ]);

    // if subscribed
    store.channel.subscribed = true;
    opt = wrapper.instance().getOptions();

    expect(opt).toEqual([ 'Cancel', 'Unsubscribe', 'Block', 'Report' ]);

    // if blocked
    store.channel.blocked = true;
    opt = wrapper.instance().getOptions();
    expect(opt).toEqual([ 'Cancel', 'Unsubscribe', 'Un-Block', 'Report' ]);
  });

  it('should show run the correct option', () => {

    const navigation = {navigate: jest.fn()};
    const wrapper = shallow(
      <ChannelActions channel={store} navigation={navigation}/>
    );

    store.channel.subscribed = true;
    store.channel.blocked = true;

    opt = wrapper.instance().makeAction(1);
    expect(store.subscribe).toBeCalled();

    opt = wrapper.instance().makeAction(2);
    expect(store.toggleBlock).toBeCalled();

    opt = wrapper.instance().makeAction(3);
    expect(navigation.navigate).toBeCalled();
  });

});