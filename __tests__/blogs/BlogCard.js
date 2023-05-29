import 'react-native';
import React from 'react';
import { Platform, Linking } from 'react-native';
import { shallow } from 'enzyme';
import BlogCard from '../../src/blogs/BlogCard';
import blogFakeFactory from '../../__mocks__/fake/blogs/BlogFactory';
import BlogModel from '../../src/blogs/BlogModel';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import Actions from '../../src/newsfeed/activity/Actions';

Linking.openURL = jest.fn();

jest.mock('../../src/newsfeed/activity/Actions', () => 'Actions');

/**
 * Tests
 */
describe('blog card component', () => {
  it('should renders correctly', () => {
    const blogEntity = BlogModel.create(blogFakeFactory(1));

    const blog = renderer.create(<BlogCard entity={blogEntity} />).toJSON();

    expect(blog).toMatchSnapshot();
  });

  it('should nav to blog', done => {
    const blogEntity = BlogModel.create(blogFakeFactory(1));
    blogEntity.can = () => true;

    const navigation = { push: jest.fn() };

    try {
      const wrapper = shallow(
        <BlogCard entity={blogEntity} navigation={navigation} />,
      );

      Platform.OS = 'ios';

      // call method
      wrapper.instance().navToBlog();

      // expect fn to be called once
      expect(navigation.push).toBeCalledWith('BlogView', { blog: blogEntity });
      done();
    } catch (e) {
      done.fail(e);
    }
  });
});
