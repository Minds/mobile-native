import React from 'react';
import TwitterSyncScreen from './TwitterSyncScreen';
import { shallow } from 'enzyme';

describe('TwitterSyncScreen', () => {
  test('renders correctly', () => {
    const component = shallow(<TwitterSyncScreen />);

    expect(component).toMatchSnapshot();
  });
});
