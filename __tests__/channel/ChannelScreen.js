import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';
import ChannelScreen from '../../src/channel/ChannelScreen';
import { activitiesServiceFaker } from '../../__mocks__/fake/ActivitiesFaker';
import userFaker from '../../__mocks__/fake/channel/UserFactory'
import UserModel, { USER_MODE_CLOSED, USER_MODE_OPEN } from '../../src/channel/UserModel';
import featuresService from '../../src/common/services/features.service';

jest.mock('../../src/common/helpers/abortableFetch');
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

  let screen, channel, navigation, user, channelStore;

  beforeEach(() => {

    let activityResponse = activitiesServiceFaker().load(1);
    let activity = activityResponse.activities[0];
    activity.wire_totals = { tokens: 20};
    activity.impressions = 20;

    navigation = { navigate: jest.fn(), goBack: jest.fn() };
    navigation.state = {
        params: {
            entity: activity
        }
    };
    channelStore = {
      channel: new UserModel(userFaker(1)),
      setChannel: jest.fn(),
      feedStore: {
        setChannel: jest.fn(),
      },
      rewards: {
        merged: []
      },
      load: jest.fn(),
    };

    channel = { store: jest.fn() };

    channel.store.mockReturnValue(channelStore);

    screen = shallow(
      <ChannelScreen.wrappedComponent channel={channel} navigation={navigation} />
    );

  });

  it('should renders correctly', () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });

  it('should have the expected components while loading, also check newsfeed', async () => {

    expect(screen.find('FeedList')).toHaveLength(1);
    let render = screen.dive();
    expect(render.find('CenteredLoading')).toHaveLength(0);
    expect(screen.find('CaptureFab')).toHaveLength(1);
  });

  it('should have the expected components while loading, also check flatlist for blocked', async () => {

    channelStore.channel.blocked = true;

    await screen.update();

    expect(screen.find('FeedList')).toHaveLength(0);
    let render = screen.dive();
    expect(render.find('CenteredLoading')).toHaveLength(0);
    expect(screen.find('CaptureFab')).toHaveLength(1);
  });

  it('should show closed channel message', async () => {

    channelStore.channel.blocked = false;
    channelStore.channel.mode = USER_MODE_CLOSED;

    await screen.update();

    expect(screen).toMatchSnapshot();
  });


  it('should navigate back if the the VIEW permissions are removed', async () => {

    channelStore.channel.mode = USER_MODE_OPEN;

    // force permissions feature flag
    featuresService.features = {permissions: true};

    channelStore.channel.setPermissions({permissions:[]});

    await screen.update();

    expect(navigation.goBack).toBeCalled();

  });

});