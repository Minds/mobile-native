import 'react-native';
import React from 'react';
import Captcha from '../../../src/common/components/Captcha';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const callback = jest.fn();
  const captcha = renderer.create(<Captcha onResult={callback} />).toJSON();
  expect(captcha).toMatchSnapshot();
});
