import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';
import { whenWithTimeout } from 'mobx-utils';
import { useStrict } from 'mobx';

import LicensePicker from '../../src/common/components/LicensePicker';
import CaptureStore from  '../../src/capture/CaptureStore';
import CapturePosterFlags from '../../src/capture/CapturePosterFlags';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('../../src/capture/CaptureStore');
jest.mock('../../src/common/components/LicensePicker', () => 'LicensePicker');

defaultState = {
  mature: false,
  share: false,
  lock: false
}

/**
 * Test render with  value
 */
const testRenderWithValue = (value) => {
  fn = () => null;

  const store = new CaptureStore();

  state = {
    mature: value,
    share: value,
    lock: value
  }

  const preview = renderer.create(
    <CapturePosterFlags.wrappedComponent
        capture={store}
        matureValue={state.mature}
        shareValue={state.share}
        lockValue={state.lock}
        onMature={fn}
        onShare={fn}
        onLocking={fn}
      />
  ).toJSON();
  expect(preview).toMatchSnapshot();
}

// turn off mobx strict mode
useStrict(false);

/**
 * Tests
 */
describe('cature poster flags component', () => {

  it('should renders correctly for props false', () => {
    testRenderWithValue(false)
  });

  it('should renders correctly for props true', () => {
    testRenderWithValue(true)
  });


  it('should load third party social networks status on will mount', () => {

    const store = new CaptureStore();

    store.loadThirdPartySocialNetworkStatus.mockClear();

    const wrapper = shallow(
      <CapturePosterFlags.wrappedComponent
        capture={store}
        matureValue={defaultState.mature}
        shareValue={defaultState.share}
        lockValue={defaultState.lock}
        onMature={fn}
        onShare={fn}
        onLocking={fn}
      />
    );

    // run will mount
    wrapper.instance().componentWillMount();

    expect(store.loadThirdPartySocialNetworkStatus).toHaveBeenCalled();
  });

  it('should show license picker if it has an attachment', () => {

    const store = new CaptureStore();

    //store.attachment.hasAttachment = true;

    const wrapper = shallow(
      <CapturePosterFlags.wrappedComponent
        capture={store}
        matureValue={defaultState.mature}
        shareValue={defaultState.share}
        lockValue={defaultState.lock}
        onMature={fn}
        onShare={fn}
        onLocking={fn}
      />
    );
    let picker;
    // find License picker
    picker = wrapper.dive().find(LicensePicker);

    // check there is no license picker
    expect(picker.length).toEqual(0);

    store.attachment.hasAttachment = true;

    // update the component
    wrapper.update();

    picker = wrapper.dive().find(LicensePicker);

    // check there is 1 license picker
    expect(picker.length).toEqual(1);
  });

});
