import React from 'react';
import 'react-native';
import { render, waitFor } from '@testing-library/react-native';
import Slider from '../../../../src/discovery/customize/Slider';

const mockData = {
  id: 'coso',
  title: 'Political Content',
  value: 50,
  leftText: 'LESS',
  rightText: 'MORE',
};

describe('Slider component', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<Slider data={mockData} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
