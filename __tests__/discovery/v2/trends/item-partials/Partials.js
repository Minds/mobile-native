import 'react-native';
import React from 'react';
import { render } from '@testing-library/react-native';

import TrendingHashtagPartial from '~/discovery/v2/trends/item-partials/TrendingHashtagPartial';
import RichPartial from '~/discovery/v2/trends/item-partials/RichPartial';
import HeroPartial from '~/discovery/v2/trends/item-partials/HeroPartial';
import { TrendingActivity } from '~/../__mocks__/fake/discovery/TrendingActivity';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');
sp.mockService('i18n');
sp.mockService('settings');

const data = TrendingActivity;

describe('Partials tests', () => {
  it('renders correctly TrendingHashtagPartial', () => {
    const { toJSON } = render(<TrendingHashtagPartial data={data} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders correctly RichPartial', () => {
    const { toJSON } = render(<RichPartial data={data} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders correctly HeroPartial', () => {
    const { toJSON } = render(<HeroPartial data={data} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
