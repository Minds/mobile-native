import { shallow } from 'enzyme';
import React from 'react';
import 'react-native';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');
sp.mockService('i18n');
// Note: test renderer must be required after react-native.
import AnalyticsScreen from '../../src/analytics/AnalyticsScreen';

/**
 * Tests
 */
describe('AnalyticsScreen component', () => {
  it('should render correctly', () => {
    const component = shallow(<AnalyticsScreen />);

    expect(component).toMatchSnapshot();
  });
});
