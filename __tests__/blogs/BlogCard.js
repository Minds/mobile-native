import 'react-native';
import React from 'react';
import { Platform, Linking } from 'react-native';
import { shallow } from 'enzyme';
import BlogCard from '../../src/blogs/BlogCard';
import blogFakeFactory from '../../__mocks__/fake/blogs/BlogFactory'
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

Linking.openURL = jest.fn();

/**
 * Tests
 */
describe('blog card component', () => {

  it('should renders correctly', () => {

    const blogEntity = blogFakeFactory(1);

    const blog = renderer.create(
      <BlogCard entity={blogEntity} />
    ).toJSON();

    expect(blog).toMatchSnapshot();
  });

  it('should nav to blog on ios', async (done) => {

    const blogEntity = blogFakeFactory(1);

    const navigation = {navigate: jest.fn()};

    try {
      const wrapper = shallow(
        <BlogCard entity={blogEntity} navigation={navigation}/>
      );

      Platform.OS = 'ios';

      // call method
      wrapper.instance().navToBlog();

      // expect fn to be called once
      expect(navigation.navigate).toBeCalledWith('BlogView', {blog:blogEntity});
      done();
    } catch(e) {
      done.fail(e);
    }
  });

  it('should open browser to blog on android', async (done) => {

    const blogEntity = blogFakeFactory(1);

    const navigation = {navigate: jest.fn()};

    try {
      const wrapper = shallow(
        <BlogCard entity={blogEntity} navigation={navigation}/>
      );

      Platform.OS = 'android';

      // call method
      wrapper.instance().navToBlog();

      // expect fn to be called once
      expect(Linking.openURL).toBeCalled();
      done();
    } catch(e) {
      done.fail(e);
    }
  });
});