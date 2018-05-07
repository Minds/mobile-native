import 'react-native';
import React from 'react';
import {
  TouchableHighlight,
  Platform
} from 'react-native';
import { shallow } from 'enzyme';
import CaptureTabs from '../../src/capture/CaptureTabs';
import attachmentService from '../../src/common/services/attachment.service';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

const imageResponse = {
  uri: 'file://someimage.jpg',
  type: 'image/jpeg',
  fileName: 'image.jpg'
}

/**
 * Tests
 */
describe('cature tabs component', () => {

  it('should renders correctly', () => {
    const tabs = renderer.create(
      <CaptureTabs  />
    ).toJSON();
    expect(tabs).toMatchSnapshot();
  });

  it('should calls attachment.gallery and return the media', async(done) => {

    // mock the function
    attachmentService.gallery = jest.fn();
    attachmentService.gallery.mockResolvedValue(imageResponse);

    const mockFn = jest.fn();

    Platform.OS = 'ios';

    try {
      const wrapper = shallow(
        <CaptureTabs  onSelectedMedia={mockFn}/>
      );

      // find TouchableOpacity (rendered images in lists)
      const tabs = wrapper.dive().find(TouchableHighlight);

      // simulate press on first tab (gallery)
      tabs.at(0).simulate('press');

      // we use set inmediate to run the check after the async function is called
      setImmediate(() => {
        // expect fn to be called once
        expect(mockFn).toBeCalled();
        done();
      }, 0);
    } catch(e) {
      done.fail(e);
    }
  });

  it('should calls attachment.photo and return the media', async(done) => {

    // mock the function
    attachmentService.photo = jest.fn();
    attachmentService.photo.mockResolvedValue(imageResponse);

    const mockFn = jest.fn();

    try {
      const wrapper = shallow(
        <CaptureTabs  onSelectedMedia={mockFn}/>
      );

      // find TouchableOpacity (rendered images in lists)
      const tabs = wrapper.dive().find(TouchableHighlight);

      // simulate press on second tab (gallery)
      tabs.at(1).simulate('press');

      // we use set inmediate to run the check after the async function is called
      setImmediate(() => {
        // expect fn to be called once
        expect(mockFn).toBeCalled();
        done();
      }, 0);
    } catch(e) {
      done.fail(e);
    }
  });

  it('should calls attachment.video and return the media', async(done) => {

    // mock the function
    attachmentService.video = jest.fn();
    attachmentService.video.mockResolvedValue(imageResponse);

    const mockFn = jest.fn();

    try {
      const wrapper = shallow(
        <CaptureTabs  onSelectedMedia={mockFn}/>
      );

      // find TouchableOpacity (rendered images in lists)
      const tabs = wrapper.dive().find(TouchableHighlight);

      // simulate press on third tab (gallery)
      tabs.at(2).simulate('press');

      // we use set inmediate to run the check after the async function is called
      setImmediate(() => {
        // expect fn to be called once
        expect(mockFn).toBeCalled();
        done();
      }, 0);
    } catch(e) {
      done.fail(e);
    }
  });

});
