import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';
import {
  FlatList,
  KeyboardAvoidingView
} from 'react-native';

import ActivityScreen from '../../../src/newsfeed/ActivityScreen';
// import SingleEntityStore from '../../../src/common/stores/SingleEntityStore';
import RichEmbedStore from '../../../src/common/stores/RichEmbedStore';
import commentsStoreProvider from '../../../src/comments/CommentsStoreProvider';

import { commentsServiceFaker } from '../../../__mocks__/fake/CommentsFaker';
import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';
import CommentList from '../../../src/comments/CommentList';
jest.mock('../../../src/newsfeed/NewsfeedService');
import { getSingle } from '../../../src/newsfeed/NewsfeedService';

jest.mock('../../../src/newsfeed/activity/Activity', () => 'Activity');
jest.mock('../../../src/comments/CommentList', () => 'CommentList');
jest.mock('../../../src/common/components/CenteredLoading', () => 'CenteredLoading');
jest.mock('../../../src/comments/CommentsStore');
jest.mock('../../../src/comments/CommentsStoreProvider');

describe('Activity screen component', () => {

  let user, comments, entity, screen, navigation;
  beforeEach(() => {
    let mockResponse = commentsServiceFaker().load(5);
    commentsStoreProvider.get.mockReturnValue({
      comments: mockResponse.comments,
      embed: new RichEmbedStore(),
      loadNext: mockResponse['load-next'],
      loadPrevious: mockResponse['load-previous'],
      setText: () => {},
      post: () => {},
      loadComments: () => {
        return mockResponse.comments;
      },
      attachment:{}
    });
  });

  it('renders correctly with an entity as param', async () => {
    navigation = {
      push: jest.fn(),
      state: {
        routeName: 'some',
        params: {entity: activitiesServiceFaker().load(1).activities[0]}
      }
    };
    screen = shallow(
      <ActivityScreen navigation={navigation}/>
    );
    expect(screen).toMatchSnapshot();

    // should have a comment list component
    expect(screen.find(CommentList)).toHaveLength(1);
  });

  it('should show loader until it loads the activity', async (done) => {
    navigation = {
      push: jest.fn(),
      state: {
        routeName: 'some',
        params: {guid: '1'}
      }
    };

    getSingle.mockResolvedValue(activitiesServiceFaker().load(1).activities[0]);

    screen = shallow(
      <ActivityScreen navigation={navigation}/>
    );
    // shoul show loading
    expect(screen).toMatchSnapshot();

    screen.update();

    // workaround to run after the async didmount
    setImmediate(() => {
      // should show the activity
      expect(screen).toMatchSnapshot();
      done();
    });
  });
});
