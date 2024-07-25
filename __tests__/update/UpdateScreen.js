import 'react-native';
import React from 'react';
import { render } from '@testing-library/react-native';
import UpdateScreen from '~/update/UpdateScreen';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');
jest.mock('rn-update-apk', () => ({}));

// mock services
sp.mockService('styles');
sp.mockService('i18n');
const update = sp.mockService('update');
update.version = '1.0.0';

describe('Update Screen Component', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<UpdateScreen />);
    expect(toJSON()).toMatchSnapshot();
  });
});
