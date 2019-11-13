import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';
import ReferralsScreen from '../../src/share/ReferralsScreen';
import UserStore from '../../src/auth/UserStore';
import ReferralsList from '../../src/share/ReferralsList';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import ReferralsStore from '../../src/share/ReferralsStore';

jest.mock('../../src/auth/UserStore');
jest.mock('../../src/share/ReferralsStore');
jest.mock('../../src/share/ReferralsList', () => 'ReferralsList');


/**
 * Tests
 */
describe('referrals screen component', () => {

  let user, store;
  beforeEach(() => {
    user = new UserStore();
    user.me = {
      guid: 'guidguid'
    };
    store = new ReferralsStore();
  });

  it('should renders correctly', () => {

    const component = renderer.create(
      <ReferralsScreen user={user} referrals={store} />
    ).toJSON();

    expect(component).toMatchSnapshot();
  });
});