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
import entitiesService from '../../../src/common/services/entities.service';

jest.mock('../../../src/common/BaseModel');
jest.mock('../../../src/newsfeed/activity/Activity', () => 'Activity');
jest.mock('../../../src/comments/CommentList', () => 'CommentList');
jest.mock('../../../src/common/components/CenteredLoading', () => 'CenteredLoading');
jest.mock('../../../src/comments/CommentsStore');
jest.mock('../../../src/comments/CommentsStoreProvider');
jest.mock('../../../src/common/services/entities.service');


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

    entitiesService.single.mockResolvedValue(navigation.state.params.entity);

    screen = shallow(
      <ActivityScreen navigation={navigation}/>
    );

    // shoul show loading
    expect(screen).toMatchSnapshot();

    // unmount
    await screen.instance().componentDidMount();

    jest.runAllTicks();

    // await is important here!
    await screen.update();

    // should show the activity
    expect(screen).toMatchSnapshot();
    // should have a comment list component
    expect(screen.find(CommentList)).toHaveLength(1);
  });
});
