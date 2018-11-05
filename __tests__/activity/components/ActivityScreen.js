import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';

import ActivityScreen from '../../../src/newsfeed/ActivityScreen';
import UserStore from '../../../src/auth/UserStore';
import SingleEntityStore from '../../../src/common/stores/SingleEntityStore';
import RichEmbedStore from '../../../src/common/stores/RichEmbedStore';
import commentsStoreProvider from '../../../src/comments/CommentsStoreProvider';
import {
  FlatList,
  KeyboardAvoidingView
} from 'react-native';


import { commentsServiceFaker } from '../../../__mocks__/fake/CommentsFaker';
import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';

import renderer from 'react-test-renderer';
import CommentsStore from '../../../src/comments/CommentsStore';
import CommentModel from '../../../src/comments/CommentModel';
import Comment from '../../../src/comments/Comment';

let mockEntityStore = function() {
  entity = new SingleEntityStore();
  let entityResponse = activitiesServiceFaker().load(1);
  entity.setEntity(entityResponse.activities[0]);
  return entity;
}

jest.mock('../../../src/capture/CapturePreview', () => 'CapturePreview');
jest.mock('../../../src/newsfeed/ActivityModel', () => 'ActivityModel');
jest.mock('../../../src/comments/CommentModel', () => 'CommentModel');
jest.mock('../../../src/common/BaseModel', () => 'BaseModel');
jest.mock('../../../src/newsfeed/activity/Activity', () => 'Activity');
jest.mock('../../../src/comments/Comment', () => 'Comment');
jest.mock('../../../src/common/components/CenteredLoading', () => 'CenteredLoading');
jest.mock('../../../src/auth/UserStore');
jest.mock('../../../src/common/stores/SingleEntityStore', () => {
  return jest.fn().mockImplementation(() => {
    return mockEntityStore;
  });
});

jest.mock('../../../src/comments/CommentsStore');
jest.mock('../../../src/comments/CommentsStoreProvider');


describe('Activity screen component', () => {

  let user, comments, entity, screen;
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
    user = new UserStore();
    screen = shallow(
      <ActivityScreen.wrappedComponent user={user}/>
    );

    jest.runAllTimers();
  });

  it('renders correctly', async () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });

  it('should have a flatlist', async () => {
    screen.update();

    expect(screen.find(FlatList)).toHaveLength(1);
  });

  it('should be wrapped in a keyboard avoiding view', async () => {
    screen.update();

    expect(screen.find(KeyboardAvoidingView)).toHaveLength(1);
  });


  it('should have n comments', async () => {

    let instance = screen.instance();
    const spy = jest.spyOn(instance, 'renderComment');
    screen.update();

    expect(instance.comments.comments.length).toBe(5);
  });


  it('calls post when user comment', async () => {
    screen.update();
    let instance = screen.instance();
    const spy = jest.spyOn(instance, 'postComment');

    screen.find('TextInput').forEach(child => {
      child.simulate('changeText', 'comment');
    });
    expect(instance.comments.comments.length).toBe(5);
    await screen.find('TouchableOpacity').at(1).simulate('press');

    expect(spy).toHaveBeenCalled();
  });
});
