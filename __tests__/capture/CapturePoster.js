import 'react-native';
import React from 'react';
import { Alert } from 'react-native';
import { shallow } from 'enzyme';
import { Icon } from 'react-native-elements';
import CameraRoll from '@react-native-community/cameraroll';

import CapturePoster from '../../src/capture/CapturePoster';
import CapturePreview from '../../src/capture/CapturePreview';
import CaptureGallery from '../../src/capture/CaptureGallery';
import UserStore from '../../src/auth/UserStore';
import CaptureStore from '../../src/capture/CaptureStore';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import { getPhotosFaker } from '../../__mocks__/fake/CameraRollFaker';

jest.mock('../../src/auth/UserStore');
jest.mock('../../src/capture/CaptureStore');
jest.mock('../../src/capture/CapturePostButton', () => 'CapturePostButton');
jest.mock('../../src/capture/CapturePreview', () => 'CapturePreview');
jest.mock('../../src/capture/CapturePosterFlags', () => 'CapturePosterFlags');
jest.mock('../../src/common/services/translation.service');

Alert.alert = jest.fn();
CameraRoll.getPhotos = jest.fn();
// fake camera roll data
const response = getPhotosFaker(5);
CameraRoll.getPhotos.mockResolvedValue(response);

/**
 * Tests
 */
describe('cature poster component', () => {
  let userStore, capture;
  const navigation = {
    navigate: jest.fn(),
    dispatch: jest.fn(),
    setOptions: jest.fn(),
    goBack: jest.fn(),
  };
  const route = { params: {} };

  const paramsVideo = { uri: 'file://video.mp4', type: 'video/mp4' };

  const paramsImage = { uri: 'file://image.jpg', type: 'image/jpeg' };

  beforeEach(() => {
    userStore = new UserStore();
    capture = new CaptureStore();
    capture.attachment.attachMedia.mockClear();
    navigation.navigate.mockClear();
    navigation.dispatch.mockClear();
    navigation.setOptions.mockClear();
    capture.post.mockClear();
  });

  it('should renders correctly', () => {
    const screen = renderer
      .create(
        <CapturePoster.wrappedComponent
          user={userStore}
          capture={capture}
          navigation={navigation}
          route={route}
        />,
      )
      .toJSON();

    expect(screen).toMatchSnapshot();
  });

  it('should receive text parameters on did mount', () => {
    route.params = { text: 'hello' };

    const wrapper = shallow(
      <CapturePoster.wrappedComponent
        user={userStore}
        capture={capture}
        navigation={navigation}
        route={route}
      />,
    );

    // should be called
    expect(capture.setText).toHaveBeenCalled();

    // should be called with text hello
    expect(capture.setText).toHaveBeenCalledWith('hello');
  });

  it('should receive image parameters on did mount and attach it', () => {
    route.params = { image: 'file://image.jpg' };

    const wrapper = shallow(
      <CapturePoster.wrappedComponent
        user={userStore}
        capture={capture}
        navigation={navigation}
        route={route}
      />,
    );

    // should be called
    expect(capture.attachment.attachMedia).toHaveBeenCalled();

    // should be called only once
    expect(capture.attachment.attachMedia.mock.calls.length).toBe(1);

    // should be called with the image
    expect(capture.attachment.attachMedia.mock.calls[0][0]).toEqual({
      type: 'image/jpeg',
      uri: 'file://image.jpg',
    });
  });

  it('should receive video parameters on did mount and attach it', () => {
    route.params = { video: 'file://video.mp4' };

    const wrapper = shallow(
      <CapturePoster.wrappedComponent
        user={userStore}
        capture={capture}
        navigation={navigation}
        route={route}
      />,
    );

    // should be called
    expect(capture.attachment.attachMedia).toHaveBeenCalled();

    // should be called only once
    expect(capture.attachment.attachMedia.mock.calls.length).toBe(1);

    // should be called with the video
    expect(capture.attachment.attachMedia.mock.calls[0][0]).toEqual({
      type: 'video/mp4',
      uri: 'file://video.mp4',
    });
  });

  it('should show the preview when an image is attached', async done => {
    try {
      // emulate image attachment
      capture.attachment.hasAttachment = true;
      capture.attachment.uri = paramsImage.uri;
      capture.attachment.type = paramsImage.type;

      const wrapper = renderer.create(
        <CapturePoster.wrappedComponent
          user={userStore}
          capture={capture}
          navigation={navigation}
          route={route}
        />,
      );

      const gallery = wrapper.root.findByType(CaptureGallery);

      await gallery.instance._loadPhotos();

      // find Capture Preview
      const preview = wrapper.root.findByType(CapturePreview);

      expect(preview).toBeDefined();

      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it('should show the preview when a video is attached', async done => {
    try {
      // emulate video attachment
      capture.attachment.hasAttachment = true;
      capture.attachment.uri = paramsVideo.uri;
      capture.attachment.type = paramsVideo.type;

      const wrapper = renderer.create(
        <CapturePoster.wrappedComponent
          user={userStore}
          capture={capture}
          navigation={navigation}
          route={route}
        />,
      );

      const gallery = wrapper.root.findByType(CaptureGallery);

      await gallery.instance._loadPhotos();

      // find Capture Preview
      const preview = wrapper.root.findByType(CapturePreview);

      expect(preview).toBeDefined();

      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it('should call attachment store delete when user tap delete', async done => {
    try {
      // emulate video attachment
      capture.attachment.hasAttachment = true;
      capture.attachment.uri = paramsVideo.uri;
      capture.attachment.type = paramsVideo.type;

      const wrapper = renderer.create(
        <CapturePoster.wrappedComponent
          user={userStore}
          capture={capture}
          navigation={navigation}
          route={route}
        />,
      );

      const gallery = wrapper.root.findByType(CaptureGallery);

      await gallery.instance._loadPhotos();

      // find delete icon
      const icon = wrapper.root.findByType(Icon);

      expect(icon).toBeDefined();

      // simulate press on image
      icon.props.onPress();

      // should be called
      expect(capture.attachment.delete).toHaveBeenCalled();

      // should be called only once
      expect(capture.attachment.delete.mock.calls.length).toBe(1);

      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it('should call attachment store delete when user leave', async done => {
    try {
      // emulate video attachment
      capture.attachment.hasAttachment = true;
      capture.attachment.uri = paramsVideo.uri;
      capture.attachment.type = paramsVideo.type;

      const wrapper = shallow(
        <CapturePoster.wrappedComponent
          user={userStore}
          capture={capture}
          navigation={navigation}
          route={route}
        />,
      );

      // unmount
      await wrapper.instance().componentWillUnmount();

      // should be called
      expect(capture.attachment.delete).toHaveBeenCalled();

      // should be called only once
      expect(capture.attachment.delete.mock.calls.length).toBe(1);

      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it('should return false if the user post before finish an upload', async done => {
    try {
      // emulate video attachment
      capture.attachment.hasAttachment = true;
      capture.attachment.uri = paramsVideo.uri;
      capture.attachment.type = paramsVideo.type;
      capture.attachment.uploading = true;

      const wrapper = shallow(
        <CapturePoster.wrappedComponent
          user={userStore}
          capture={capture}
          navigation={navigation}
          route={route}
        />,
      );

      // submit
      const result = await wrapper.instance().submit();

      // should be false
      expect(result).toBe(false);

      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it('should return false if there is nothing to post', async done => {
    try {
      const wrapper = shallow(
        <CapturePoster.wrappedComponent
          user={userStore}
          capture={capture}
          navigation={navigation}
          route={route}
        />,
      );

      // submit
      const result = await wrapper.instance().submit();

      // should be false
      expect(result).toBe(false);

      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it("should call store's post on submit and return the response", async done => {
    try {
      const wrapper = shallow(
        <CapturePoster.wrappedComponent
          user={userStore}
          capture={capture}
          navigation={navigation}
          route={route}
        />,
      );

      wrapper.instance().setText('some awesome post');

      const response = { entity: { guid: 1, title: 'some awesome post' } };

      capture.post.mockResolvedValue(response);

      // submit
      const result = await wrapper.instance().submit();

      // should be called
      expect(capture.post).toHaveBeenCalled();

      // should be called only once
      expect(capture.post.mock.calls.length).toBe(1);

      const entity = capture.post.mock.calls[0][0];
      expect(capture.post.mock.calls[0][0]).toEqual({
        nsfw: [],
        message: 'some awesome post',
        wire_threshold: null,
        time_created: entity.time_created,
      });

      expect(result).toEqual(response);

      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it('should call onComplete after submit', async done => {
    try {
      const onCompleteMock = jest.fn();

      const wrapper = shallow(
        <CapturePoster.wrappedComponent
          user={userStore}
          capture={capture}
          navigation={navigation}
          route={route}
          onComplete={onCompleteMock}
        />,
      );

      wrapper.instance().setText('some awesome post');

      const response = { entity: { guid: 1, title: 'some awesome post' } };

      capture.post.mockResolvedValue(response);

      // submit
      const result = await wrapper.instance().submit();

      // should be called
      expect(onCompleteMock).toHaveBeenCalled();

      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it('should add third party networks share to post', async done => {
    try {
      const wrapper = shallow(
        <CapturePoster.wrappedComponent
          user={userStore}
          capture={capture}
          navigation={navigation}
          route={route}
        />,
      );

      wrapper.instance().setText('some awesome post');
      wrapper.instance().onShare('facebook');
      wrapper.instance().onShare('twitter');

      const response = { entity: { guid: 1, title: 'some awesome post' } };

      capture.post.mockResolvedValue(response);

      // submit
      const result = await wrapper.instance().submit();

      // should be called
      expect(capture.post).toHaveBeenCalled();

      // should be called only once
      expect(capture.post.mock.calls.length).toBe(1);

      const entity = capture.post.mock.calls[0][0];
      expect(capture.post.mock.calls[0][0]).toEqual({
        nsfw: [],
        message: 'some awesome post',
        wire_threshold: null,
        facebook: 1,
        twitter: 1,
        time_created: entity.time_created,
      });

      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it("should call store's post with attachment guid", async done => {
    try {
      const wrapper = shallow(
        <CapturePoster.wrappedComponent
          user={userStore}
          capture={capture}
          navigation={navigation}
          route={route}
        />,
      );

      // emulate image attachment
      capture.attachment.hasAttachment = true;
      capture.attachment.guid = 1000;
      capture.attachment.uri = paramsImage.uri;
      capture.attachment.type = paramsImage.type;
      capture.attachment.uploading = false;

      wrapper.instance().setText('some awesome post');

      const response = { entity: { guid: 1, title: 'some awesome post' } };

      capture.post.mockResolvedValue(response);

      // submit
      const result = await wrapper.instance().submit();

      // should be called
      expect(capture.post).toHaveBeenCalled();

      // should be called only once
      expect(capture.post).toBeCalled();

      const entity = capture.post.mock.calls[0][0];

      // should send the attachment data
      expect(capture.post.mock.calls[0][0]).toEqual({
        nsfw: [],
        message: 'some awesome post',
        wire_threshold: null,
        attachment_guid: 1000,
        attachment_license: '',
        time_created: entity.time_created,
      });
      console.log(result)
      // should return server response
      expect(result).toEqual(response);

      // should clear the attachment
      expect(capture.attachment.clear).toHaveBeenCalled();

      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it('should alert the user on submit error', async done => {
    try {
      const wrapper = shallow(
        <CapturePoster.wrappedComponent
          user={userStore}
          capture={capture}
          navigation={navigation}
          route={route}
        />,
      );

      wrapper.instance().setText('some awesome post');

      capture.post.mockResolvedValue(new Error('some error'));

      // submit
      const result = await wrapper.instance().submit();

      // should be called
      expect(Alert.alert).toHaveBeenCalled();

      done();
    } catch (e) {
      done.fail(e);
    }
  });
});
