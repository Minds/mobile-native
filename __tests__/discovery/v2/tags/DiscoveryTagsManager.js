import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';
import DiscoveryTagsManager from '../../../../src/discovery/v2/tags/DiscoveryTagsManager';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import { getStores } from '../../../../AppStores';
import { createClassStores } from '../../../../src/common/contexts';

jest.mock('../../../../src/common/hooks/use-stores.tsx');
/**
 * Tests
 */
describe('DiscoveryTagsManager component', () => {
  it('should render correctly', () => {
    getStores.mockReturnValue(createClassStores());

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
