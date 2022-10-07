import { render, screen } from '@testing-library/react-native';
import * as React from 'react';
import StripeCardSelector from './StripeCardSelector';

jest.mock('../InputSelectorV2', () => () => null);

describe('StripeCardSelector', () => {
  test('should render correctly', () => {
    render(<StripeCardSelector onCardSelected={jest.fn()} />);
    expect(screen.toJSON()).toMatchSnapshot();
  });
});
