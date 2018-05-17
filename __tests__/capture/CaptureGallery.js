import 'react-native';
import React from 'react';
import { Platform, CameraRoll, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';
import CaptureGallery from '../../src/capture/CaptureGallery';
import androidPermission from '../../src/common/services/android-permissions.service';
import { getPhotosFaker } from '../../__mocks__/fake/CameraRollFaker';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('../../src/common/services/android-permissions.service');

/**
 * Tests
 */
describe('cature gallery component', () => {
  beforeEach(() => {
    androidPermission.checkReadExternalStorage.mockClear();
    androidPermission.readExternalStorage.mockClear();
  });

  it('should renders correctly', () => {
    const galley = renderer.create(
      <CaptureGallery  />
    ).toJSON();
    expect(galley).toMatchSnapshot();
  });

  it('should load photos on mount', () => {
    const spyWillMount = jest.spyOn(CaptureGallery.prototype, '_loadPhotos');

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

    // fake camera roll data
    const response = getPhotosFaker(5);

    CameraRoll.getPhotos = jest.fn();
    CameraRoll.getPhotos.mockResolvedValue(response);

    const mockFn = jest.fn();

    try {
      const wrapper = shallow(
        <CaptureGallery  onSelected={mockFn}/>
      );

      // load phoyos
      await wrapper.instance()._loadPhotos();

      // update component
      wrapper.update();

      // find TouchableOpacity (rendered images in lists)
      const images = wrapper.dive().find(TouchableOpacity);

      // simulate press on image
      images.at(1).simulate('press');

      // expect fn to be called once
      expect(mockFn).toBeCalled();
      done();
    } catch(e) {
      done.fail(e);
    }
  });

  it('should show loaded images', async(done) => {
    // fake camera roll data
    const response = getPhotosFaker(5);

    CameraRoll.getPhotos = jest.fn();
    CameraRoll.getPhotos.mockResolvedValue(response);

    const mockFn = jest.fn();

    try {
      const wrapper = shallow(
        <CaptureGallery  onSelected={mockFn}/>
      );

      // load phoyos
      await wrapper.instance()._loadPhotos();

      // update component
      wrapper.update();

      // find TouchableOpacity (rendered images in lists)
      const images = wrapper.dive().find(TouchableOpacity);

      // expect 5 images rendered
      expect(images.length).toEqual(5);
      done();
    } catch(e) {
      done.fail(e);
    }
  });
});

