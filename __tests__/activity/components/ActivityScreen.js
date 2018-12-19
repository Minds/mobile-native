import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';
import {
  FlatList,
  KeyboardAvoidingView
} from 'react-native';

import ActivityScreen from '../../../src/newsfeed/ActivityScreen';
import UserStore from '../../../src/auth/UserStore';
import SingleEntityStore from '../../../src/common/stores/SingleEntityStore';
import RichEmbedStore from '../../../src/common/stores/RichEmbedStore';
import commentsStoreProvider from '../../../src/comments/CommentsStoreProvider';

import { commentsServiceFaker } from '../../../__mocks__/fake/CommentsFaker';
import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';
import CommentList from '../../../src/comments/CommentList';

jest.mock('../../../src/newsfeed/activity/Activity', () => 'Activity');
jest.mock('../../../src/comments/CommentList', () => 'CommentList');
jest.mock('../../../src/common/components/CenteredLoading', () => 'CenteredLoading');
jest.mock('../../../src/auth/UserStore');

// jest.mock('../../../src/comments/CommentModel');
jest.mock('../../../src/comments/CommentsStore');
jest.mock('../../../src/comments/CommentsStoreProvider');


describe('Activity screen component', () => {

  let user, comments, entity, screen, navigation;
  beforeEach(() => {
    navigation = {
      push: jest.fn(),
      state: {
        routeName: 'some',
        params: {entity: activitiesServiceFaker().load(1).activities[0]}
      }
    };
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
    user = new UserStore();
    screen = shallow(
      <ActivityScreen user={user} navigation={navigation}/>
    );

    jest.runAllTimers();
  });

  it('renders correctly', async () => {
    expect(screen).toMatchSnapshot();
  });

  it('should have a CommentList', async () => {
    expect(screen.find(CommentList)).toHaveLength(1);
  });
});
