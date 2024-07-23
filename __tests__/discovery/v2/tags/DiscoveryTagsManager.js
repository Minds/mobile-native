import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';
import DiscoveryTagsManager from '~/discovery/v2/tags/DiscoveryTagsManager';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');

jest.mock('~/common/hooks/use-stores.tsx');
/**
 * Tests
 */
describe('DiscoveryTagsManager component', () => {
  it('should render correctly', () => {
    const component = shallow(
      <DiscoveryTagsManager
        show={false}
        onClose={() => {}}
        onDone={() => {}}
      />,
    );

    expect(component).toMatchSnapshot();
  });
});
