import 'react-native';
import React from 'react';
import TwitterSyncScreen from './TwitterSyncScreen';
import { shallow } from 'enzyme';
import { QueryProvider } from '~/services';

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
