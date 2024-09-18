import 'react-native';
import React from 'react';
import TopbarTabbar from '../../../../src/common/components/topbar-tabbar/TopbarTabbar';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tabs = [
    { id: 'tokens', title: 'Tokens', subtitle: '711' },
    { id: 'usd', title: 'USD', subtitle: '$123' },
    { id: 'eth', title: 'Ether', subtitle: '133' },
    { id: 'btc', title: 'Bitcoin', subtitle: '153' },
  ];
  const topbarTabbar = renderer.create(<TopbarTabbar tabs={tabs} />).toJSON();
  expect(topbarTabbar).toMatchSnapshot();
});
