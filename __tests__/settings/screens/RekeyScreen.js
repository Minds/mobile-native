import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';

import RekeyScreen from '../../../src/settings/screens/RekeyScreen';
import MessengerSetup from '../../../src/messenger/MessengerSetup';

jest.mock('../../../src/messenger/MessengerSetup', () => 'MessengerSetup');

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

describe('Rekey screen component', () => {
  it('should renders correctly', () => {

    const navigation = {};

    const rendered = renderer.create(
      <RekeyScreen navigation={navigation}/>
    ).toJSON();

    expect(rendered).toMatchSnapshot();
  });

  it('should go back on done', () => {

    const navigation = {goBack: jest.fn()};

    const wrapper = shallow(
      <RekeyScreen navigation={navigation}/>
    )

    // call method
    wrapper.instance().onDone();

    expect(navigation.goBack).toBeCalled();
  });
});
