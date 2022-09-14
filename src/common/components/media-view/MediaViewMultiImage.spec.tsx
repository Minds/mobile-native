// @ts-nocheck
import { render, screen } from '@testing-library/react-native';
import * as React from 'react';
import MediaViewMultiImage from './MediaViewMultiImage';

describe('MediaViewMultiImage', () => {
  it('should render 2 images correctly', async () => {
    const entity = generateFakeMultiImageEntity({ images: 2 });
    render(<MediaViewMultiImage entity={entity} />);
    checkImagesMatch(entity, 2);
    expect(screen.toJSON()).toMatchSnapshot();
  });
  it('should render 3 images correctly', async () => {
    const entity = generateFakeMultiImageEntity({ images: 3 });
    render(<MediaViewMultiImage entity={entity} />);
    checkImagesMatch(entity, 3);
    expect(screen.toJSON()).toMatchSnapshot();
  });
  it('should render 4 images correctly', async () => {
    const entity = generateFakeMultiImageEntity({ images: 4 });
    render(<MediaViewMultiImage entity={entity} />);
    checkImagesMatch(entity, 4);
    expect(screen.toJSON()).toMatchSnapshot();
  });
});

const checkImagesMatch = (entity, length) => {
  let images = [];
  entity.custom_data.map(image => {
    const i = screen.getByTestId('image-' + image.src);
    if (i) {
      images.push(i);
    }
  });

  expect(images.length).toBe(length);
};

const generateFakeMultiImageEntity = (
  { images, blurred, locked } = { images: 2 },
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
