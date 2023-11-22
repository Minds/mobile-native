import 'react-native';
import React from 'react';
import { render } from '@testing-library/react-native';
import UpdateScreen from '../../src/update/UpdateScreen';

jest.mock('../../src/common/services/update.service');

describe('Update Screen Component', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<UpdateScreen />);
    expect(toJSON()).toMatchSnapshot();
  });
});
