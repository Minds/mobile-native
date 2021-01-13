import 'react-native';
import React from 'react';
import BlogsViewScreen from '../../src/blogs/BlogsViewScreen';
import BlogsViewStore from '../../src/blogs/BlogsViewStore';
import blogsFaker from '../../__mocks__/fake/blogs/BlogFactory';
import BlogModel from '../../src/blogs/BlogModel';
import UserStore from '../../src/auth/UserStore';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import NavigationService from '../../src/navigation/NavigationService';
import { StoresProvider } from '../../src/common/hooks/use-stores';

jest.mock('../../src/navigation/NavigationService');
jest.mock('../../src/blogs/BlogsViewStore');
jest.mock('../../src/auth/UserStore');
jest.mock('../../src/blogs/BlogViewHTML', () => 'BlogViewHTML');
jest.mock(
  '../../src/comments/v2/CommentBottomSheet',
  () => 'CommentBottomSheet',
);
jest.mock(
  '../../src/newsfeed/activity/actions/RemindAction',
  () => 'RemindAction',
);
jest.mock(
  '../../src/newsfeed/activity/actions/ThumbUpAction',
  () => 'ThumbUpAction',
);
jest.mock(
  '../../src/newsfeed/activity/actions/ThumbDownAction',
  () => 'ThumbDownAction',
);
jest.mock(
  '../../src/newsfeed/activity/actions/CommentsAction',
  () => 'CommentsAction',
);

/**
 * Tests
 */
describe('blog view screen component', () => {
  let store,
    user,
    route,
    navigation = {};

  beforeEach(() => {
    NavigationService.getCurrentState.mockClear();
    NavigationService.getCurrentState.mockReturnValue({});
    store = new BlogsViewStore();
    user = new UserStore();
    user.me = {
      guid: 'guidguid',
    };
  });

  it('should renders correctly', () => {
    store.blog = BlogModel.create(blogsFaker('1'));

    route = { params: { guid: 1 } };

    const component = renderer
      .create(
        <StoresProvider>
          <BlogsViewScreen.wrappedComponent
            blogsView={store}
            navigation={navigation}
            route={route}
            user={user}
          />
        </StoresProvider>,
      )
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  it('should load the blog by guid', () => {
    store.blog = BlogModel.create(blogsFaker('1'));

    route = { params: { guid: 1 } };

    const component = renderer.create(
      <StoresProvider>
        <BlogsViewScreen.wrappedComponent
          blogsView={store}
          navigation={navigation}
          route={route}
          user={user}
        />
      </StoresProvider>,
    );

    expect(store.loadBlog).toBeCalledWith(1);
  });

  it('should set the blog from params', () => {
    store.blog = BlogModel.create(blogsFaker('1'));

    route = { params: { blog: store.blog } };

    const component = renderer.create(
      <StoresProvider>
        <BlogsViewScreen.wrappedComponent
          blogsView={store}
          navigation={navigation}
          route={route}
          user={user}
        />
      </StoresProvider>,
    );

    expect(store.setBlog).toBeCalledWith(store.blog);
  });
});
