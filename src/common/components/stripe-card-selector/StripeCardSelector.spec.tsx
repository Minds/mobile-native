import { render, screen } from '@testing-library/react-native';
import * as React from 'react';
import StripeCardSelector from './StripeCardSelector';

import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
const mindsConfigService = sp.mockService('config');
sp.mockService('i18n');

jest.mock('../InputSelectorV2', () => () => null);
jest.mock('~/common/services/minds-config.service');
jest.mock('~/common/services/analytics.service');

describe('StripeCardSelector', () => {
  test('should render correctly', () => {
    // @ts-ignore
    mindsConfigService.getSettings.mockReturnValue({
      stripe_key: 'bla',
    });
    render(<StripeCardSelector onCardSelected={jest.fn()} />);
    expect(screen.toJSON()).toMatchSnapshot();
  });
});
