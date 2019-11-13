import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';
import ReferralsList from '../../src/share/ReferralsList';
import ReferralsStore from '../../src/share/ReferralsStore';
import referralsFaker from '../../__mocks__/fake/referral/ReferralFactory';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('../../src/share/ReferralsRow', () => 'ReferralsRow');

/**
 * Tests
 */
describe('referrals list screen component', () => {

  let store;

  beforeEach(() => {
    store = new ReferralsStore();
  });

  it('should renders correctly', () => {
    store.list.entities = referralsFaker();
    store.list.loaded = true;

    const component = renderer.create(
      <ReferralsList.wrappedComponent referrals={store} />
    ).toJSON();

    expect(component).toMatchSnapshot();
  });

  it('should load referrals on mount', () => {
    const spy = jest.spyOn(store, 'loadList');
    const wrapper = shallow(
      <ReferralsList.wrappedComponent  referrals={store}/>
    );

    expect(spy).toHaveBeenCalled();
  });

  it('should show referrals', () => {

    store.list.entities = referralsFaker();
    store.list.loaded = true;

    const testRenderer = renderer.create(
      <ReferralsList.wrappedComponent  referrals={store}/>
    );

    const testInstance = testRenderer.root;

    expect(testInstance.findAllByType('ReferralsRow').length).toBe(4);
  });
});