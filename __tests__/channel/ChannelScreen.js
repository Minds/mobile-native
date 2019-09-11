import 'react-native';
import React from 'react';
//import { Platform, CameraRoll, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';
import ChannelScreen from '../../src/channel/ChannelScreen';
import { activitiesServiceFaker } from '../../__mocks__/fake/ActivitiesFaker';
import renderer from 'react-test-renderer';

import UserStore from '../../src/auth/UserStore';


import RewardsCarousel from '../../src/channel/carousel/RewardsCarousel';
import ChannelHeader from '../../src/channel/header/ChannelHeader';
import Toolbar from '../../src/channel/toolbar/Toolbar';
import NewsfeedList from '../../src/newsfeed/NewsfeedList';
import channelService from '../../src/channel/ChannelService';
import CenteredLoading from '../../src/common/components/CenteredLoading';
import Button from '../../src/common/components/Button';
import colors from '../../src/styles/Colors';
import BlogCard from '../../src/blogs/BlogCard';
import CaptureFab from '../../src/capture/CaptureFab';
import { CommonStyle } from '../../src/styles/Common';
import UserModel from '../../src/channel/UserModel';
import Touchable from '../../src/common/components/Touchable';
import session from '../../src/common/services/session.service';
import ChannelStore from '../../src/channel/ChannelStore';
import featuresService from '../../src/common/services/features.service';

jest.mock('../../src/common/helpers/abortableFetch');
jest.mock('../../src/channel/UserModel');
jest.mock('../../src/newsfeed/ActivityModel');
jest.mock('../../src/channel/carousel/RewardsCarousel', () => 'RewardsCarousel');
jest.mock('../../src/channel/header/ChannelHeader', () => 'ChannelHeader');
jest.mock('../../src/channel/toolbar/Toolbar', () => 'Toolbar');
jest.mock('../../src/common/components/CenteredLoading', () => 'CenteredLoading');
jest.mock('../../src/common/components/Button', () => 'Button');
jest.mock('../../src/common/components/FeedList', () => 'FeedList');
jest.mock('../../src/capture/CaptureFab', () => 'CaptureFab');
jest.mock('../../src/blogs/BlogCard', () => 'BlogCard');
jest.mock('../../src/common/components/Touchable', () => 'Touchable');
jest.mock('../../src/common/services/boosted-content.service');

/**
 * Tests
 */
describe('Channel screen component', () => {

  let store, screen, entities, channel, navigation, activityResponse, user;

  beforeEach(() => {

    let activityResponse = activitiesServiceFaker().load(1);
    let activity = activityResponse.activities[0];
    activity.wire_totals = { tokens: 20};
    activity.impressions = 20;

    navigation = { navigate: jest.fn() };
    navigation.state = {
        params: {
            entity: activity
        }
    };
    channelStore = {
      channel: {
        guid:'125',
        blocked: false,
      },
      setChannel: jest.fn(),
      feedStore: {
        setChannel: jest.fn(),
      },
      rewards: {
        merged: []
      },
      load: jest.fn(),
    };

    user = new UserStore();
    channel = { store: jest.fn() };

    channel.store.mockReturnValue(channelStore);

    screen = shallow(
      <ChannelScreen.wrappedComponent channel={channel} user={user} navigation={navigation} />
    );

    screen.update();
  });

  it('should renders correctly', () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });

  it('should have the expectedComponents while loading, also check newsfeed', async () => {
    screen.update();

    expect(screen.find('FeedList')).toHaveLength(1);
    let render = screen.dive();
    expect(render.find('CenteredLoading')).toHaveLength(0);
    expect(screen.find('CaptureFab')).toHaveLength(1);
  });


  it('should have the expectedComponents while loading, also check flatlist for blocked', async () => {
    screen.update();
    channelStore = {
      channel: {
        guid:'125',
        blocked: true,
      },
      setChannel: jest.fn(),
      feedStore: {
        setChannel: jest.fn(),
      },
      rewards: {
        merged: []
      },
      load: jest.fn(),
    };

    user = new UserStore();
    channel = { store: jest.fn() };

    channel.store.mockReturnValue(channelStore);

    screen = shallow(
      <ChannelScreen.wrappedComponent channel={channel} user={user} navigation={navigation} />
    );
    expect(screen.find('FlatList')).toHaveLength(1);
    let render = screen.dive();
    expect(render.find('CenteredLoading')).toHaveLength(0);
    expect(screen.find('CaptureFab')).toHaveLength(1);
  });

});