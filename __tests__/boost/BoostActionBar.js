import 'react-native';
import React from 'react';
import { View } from 'react-native';
import { shallow } from 'enzyme';
import UserStore from '~/auth/UserStore';
import { activitiesServiceFaker } from '../../__mocks__/fake/ActivitiesFaker';
import BoostActionBar from '~/modules/boost/boost-console/components/BoostActionBar';
import MText from '~/common/components/MText';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');
sp.mockService('i18n');

// prevent double tap in touchable
jest.mock('~/modules/boost/boost-composer/boost.store');
jest.mock('~/auth/UserStore');

describe('Boost action bar component', () => {
  let screen, boost;
  beforeEach(() => {
    let activityResponse = activitiesServiceFaker().load(1);
    const navigation = { navigate: jest.fn() };
    let entity = activityResponse.activities[0];
    boost = {
      list: [],
    };
    entity.bidType = 'usd';
    entity.bid = 100;
    const userStore = new UserStore();
    screen = shallow(
      <BoostActionBar.wrappedComponent
        boost={entity}
        user={userStore}
        navigation={navigation}
      />,
    );
  });

  it('renders correctly', async () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });

  it('renders the expected text', async () => {
    screen.update();
    expect(screen.find(MText).at(0).dive().childAt(0).text()).toBe('$1.00');
  });
});
