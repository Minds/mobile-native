import 'react-native';
import { shallow } from 'enzyme';
import React from 'react';
import TrendingTab from '../../../../src/analytics/tabs/trending/TrendingTab';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');
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
