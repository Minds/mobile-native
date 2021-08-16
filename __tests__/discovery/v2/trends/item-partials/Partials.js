import 'react-native';
import React from 'react';
import { render } from '@testing-library/react-native';

import TrendingHashtagPartial from '../../../../../src/discovery/v2/trends/item-partials/TrendingHashtagPartial';
import RichPartial from '../../../../../src/discovery/v2/trends/item-partials/RichPartial';
import HeroPartial from '../../../../../src/discovery/v2/trends/item-partials/HeroPartial';
import { TrendingActivity } from '../../../../../__mocks__/fake/discovery/TrendingActivity';

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
