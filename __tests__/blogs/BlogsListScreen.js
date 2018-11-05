import 'react-native';
import React from 'react';
//import { Platform, CameraRoll, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';
import BlogsListScreen from '../../src/blogs/BlogsListScreen';
import BlogsStore from '../../src/blogs/BlogsStore';
import blogsFaker from '../../__mocks__/fake/blogs/BlogFactory';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('../../src/blogs/BlogsStore');
jest.mock('../../src/blogs/BlogCard', () => 'BlogCard');
jest.mock('../../src/newsfeed/topbar/TagsSubBar', () => 'TagsSubBar');

/**
 * Tests
 */
describe('blog list screen component', () => {

  let store;

  beforeEach(() => {
    store = new BlogsStore();
  });

  it('should renders correctly', () => {

    store.list.entities = [blogsFaker('1'), blogsFaker('2'), blogsFaker('3')];
    store.list.loaded = true;

    const component = renderer.create(
      <BlogsListScreen.wrappedComponent blogs={store} />
    ).toJSON();
    expect(component).toMatchSnapshot();
  });

  it('should load blogs on mount', () => {

    const wrapper = shallow(
      <BlogsListScreen.wrappedComponent  blogs={store}/>
    );


    expect(store.loadList).toHaveBeenCalled();
  });

  it('should show blogs', () => {

    store.list.entities = [blogsFaker('1'), blogsFaker('2'), blogsFaker('3')];
    store.list.loaded = true;

    const testRenderer = renderer.create(
      <BlogsListScreen.wrappedComponent  blogs={store}/>
    );

    const testInstance = testRenderer.root;

    expect(testInstance.findAllByType('BlogCard').length).toBe(3);
  });
});