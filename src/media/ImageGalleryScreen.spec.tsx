import { render, screen } from '@testing-library/react-native';
import * as React from 'react';
import ImageGalleryScreen from './ImageGalleryScreen';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');
// mock services
sp.mockService('styles');

jest.mock('../newsfeed/activity/BottomContent', () => () => {
  return null;
});

describe('ImageGalleryScreen', () => {
  it('should render correctly', () => {
    const entity = generateFakeMultiImageEntity({ images: 2 });
    render(
      <ImageGalleryScreen
        navigation={{} as any}
        route={{
          params: {
            entity,
          },
        }}
      />,
    );
    expect(screen.toJSON()).toMatchSnapshot();
  });
});

const generateFakeMultiImageEntity = (
  { images, blurred = false, locked = false } = { images: 2 },
) => {
  return {
    shouldBeBlured: () => blurred,
    isLocked: () => locked,
    custom_data: new Array(images)
      .fill({
        src: 'http://fake.com',
      })
      .map((image, index) => ({
        ...image,
        src: image.src + index,
      })),
  };
};
