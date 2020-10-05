import 'react-native';
import { shallow } from 'enzyme';
import React from 'react';
import DashboardTab from '../../../../src/analytics/tabs/dashboard/DashboardTab';

// Note: test renderer must be required after react-native.

/**
 * Tests
 */
describe('DashboardTab component', () => {
  it('should render correctly', () => {
    const component = shallow(<DashboardTab />);

    expect(component).toMatchSnapshot();
  });
});
