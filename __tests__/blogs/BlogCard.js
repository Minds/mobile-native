import React from 'react';
import { Platform, Linking } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import BlogCard from '~/blogs/BlogCard';
import blogFakeFactory from '../../__mocks__/fake/blogs/BlogFactory';
import BlogModel from '~/blogs/BlogModel';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');
sp.mockService('api');
sp.mockService('i18n');

Linking.openURL = jest.fn();

jest.mock('~/newsfeed/activity/Actions', () => 'Actions');

describe('blog card component', () => {
  it('should render correctly', () => {
    const blogEntity = BlogModel.create(blogFakeFactory(1));

    const { toJSON } = render(<BlogCard entity={blogEntity} />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should nav to blog', () => {
    const blogEntity = BlogModel.create(blogFakeFactory(1));
    blogEntity.can = () => true;

    const navigation = { push: jest.fn() };

    const { getByTestId } = render(
      <BlogCard entity={blogEntity} navigation={navigation} />,
    );

    Platform.OS = 'ios';

    // Assuming there's a touchable element with testID="blogCard"
    fireEvent.press(getByTestId('blogPressable'));

    expect(navigation.push).toHaveBeenCalledWith('BlogView', {
      blog: blogEntity,
    });
  });
});
