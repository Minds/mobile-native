import 'react-native';
import React from 'react';
import { Platform, TouchableOpacity } from "react-native";
import { shallow, render } from 'enzyme';
import CameraRoll from '@react-native-community/cameraroll';

import androidPermission from '../../src/common/services/android-permissions.service';
import { getPhotosFaker } from '../../__mocks__/fake/CameraRollFaker';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('../../src/common/services/android-permissions.service');
jest.mock('@react-native-community/cameraroll');
CameraRoll.getPhotos = jest.fn();
// fake camera roll data
const response = getPhotosFaker(5);
CameraRoll.getPhotos.mockResolvedValue(response);
import CaptureGallery from '../../src/capture/CaptureGallery';

/**
 * Tests
 */
describe('cature gallery component', () => {
  beforeEach(() => {
    CameraRoll.getPhotos.mockClear();
    androidPermission.checkReadExternalStorage.mockClear();
    androidPermission.readExternalStorage.mockClear();
  });

  it('should renders correctly', async() => {
    const galley = renderer.create(
      <CaptureGallery />
    ).toJSON();
    expect(galley).toMatchSnapshot();
  });

  it('should load photos on mount', () => {
    const spyWillMount = jest.spyOn(CaptureGallery.prototype, 'loadPhotos');

    Platform.OS = 'ios';

    const wrapper = shallow(
      <CaptureGallery  />
    );

    // the call is dalayed (setTimeout) so we fast-forward timers
    jest.runAllTimers();

    expect(spyWillMount).toHaveBeenCalled();
  });

  it('should check permissions on android before load photos', async () => {
    const checkReadExternalStorage = androidPermission.checkReadExternalStorage;
    const readExternalStorage = androidPermission.readExternalStorage;

    Platform.OS = 'android';

    const wrapper = shallow(
      <CaptureGallery  />
    );

    // load phoyos
    await wrapper.instance().loadPhotos();

    expect(checkReadExternalStorage).toHaveBeenCalled();
  });

  it('should ask for permissions on android if necessary', async () => {
    const checkReadExternalStorage = androidPermission.checkReadExternalStorage;
    const readExternalStorage = androidPermission.readExternalStorage;

    checkReadExternalStorage.mockResolvedValue(false);

    Platform.OS = 'android';

    const wrapper = shallow(
      <CaptureGallery  />
    );

    // load phoyos
    await wrapper.instance().loadPhotos();

    expect(readExternalStorage).toHaveBeenCalled();
  });

  it('should calls onSelected when the user select an image', async(done) => {

    const mockFn = jest.fn();

    try {
      const wrapper = renderer.create(<CaptureGallery onSelected={mockFn}/>);

      // load phoyos
      await wrapper.getInstance()._loadPhotos();

      expect( CameraRoll.getPhotos).toBeCalled();

      // find TouchableOpacity (rendered images in lists)
      const images = wrapper.root.findAllByType(TouchableOpacity);

      images[0].props.onPress();

      // expect fn to be called once
      expect(mockFn).toBeCalled();
      done();
    } catch(e) {
      done.fail(e);
    }
  });

  it('should show loaded images', async(done) => {
    const mockFn = jest.fn();

    try {
      const wrapper = renderer.create(<CaptureGallery onSelected={mockFn}/>);

      // load phoyos
      await wrapper.getInstance()._loadPhotos();

      // find TouchableOpacity (rendered images in lists)
      const images = wrapper.root.findAllByType(TouchableOpacity);

      // expect 5 images rendered
      expect(images.length).toEqual(5);
      done();
    } catch(e) {
      done.fail(e);
    }
  });
});

