import 'react-native';
import React from 'react';
import TwitterSyncScreen from './TwitterSyncScreen';
import { shallow } from 'enzyme';
import { QueryProvider } from '~/services';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');
jest.mock('react-native-modern-datepicker', () => ({}));

// mock services
sp.mockService('styles');

describe('TwitterSyncScreen', () => {
  test('renders correctly', () => {
    const component = shallow(
      <QueryProvider>
        <TwitterSyncScreen />
      </QueryProvider>,
    );

    expect(component).toMatchSnapshot();
  });
});
