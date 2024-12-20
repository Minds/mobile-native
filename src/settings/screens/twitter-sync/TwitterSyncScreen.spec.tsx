import 'react-native';
import React from 'react';
import { render } from '@testing-library/react-native';
import TwitterSyncScreen from './TwitterSyncScreen';
import { QueryProvider } from '~/services';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');
jest.mock('react-native-modern-datepicker', () => ({}));

// mock services
sp.mockService('styles');
sp.mockService('i18n');
sp.mockService('session');
sp.mockService('api');
const mindsSettings = sp.mockService('config');

describe('TwitterSyncScreen', () => {
  mindsSettings.getSettings.mockReturnValue({ twitter: null });
  test('renders correctly', () => {
    const { toJSON } = render(
      <QueryProvider>
        <TwitterSyncScreen />
      </QueryProvider>,
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
