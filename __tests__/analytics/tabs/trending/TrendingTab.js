import 'react-native';
import { shallow } from 'enzyme';
import React from 'react';
import TrendingTab from '../../../../src/analytics/tabs/trending/TrendingTab';

// Note: test renderer must be required after react-native.

/**
 * Tests
 */
describe('TrendingTab component', () => {
  it('should render correctly', () => {
    const component = shallow(<TrendingTab />);

    expect(component).toMatchSnapshot();
  });
});
