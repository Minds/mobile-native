import 'react-native';
import React from 'react';

import CapturePreview from '../../src/capture/CapturePreview';
import MindsVideo from '../../src/media/MindsVideo';
import MindsVideoV2 from '../../src/media/v2/mindsVideo/MindsVideo';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('../../src/media/MindsVideo', () => 'MindsVideo');
jest.mock('../../src/media/v2/mindsVideo/MindsVideo', () => 'MindsVideoV2');

const imageObj = {
  uri: 'file://someimage.jpg',
  type: 'image/jpeg',
}

const videoObj = {
  uri: 'file://somevideo.mp4',
  type: 'video/mp4',
}

/**
 * Tests
 */
describe('cature preview component', () => {

  it('should renders correctly for image', () => {
    const preview = renderer.create(
      <CapturePreview type={imageObj.type} uri={imageObj.uri} />
    ).toJSON();
    expect(preview).toMatchSnapshot();
  });

  it('should renders correctly for video', () => {
    const preview = renderer.create(
      <CapturePreview type={videoObj.type} uri={videoObj.uri} />
    ).toJSON();
    expect(preview).toMatchSnapshot();
  });
});
