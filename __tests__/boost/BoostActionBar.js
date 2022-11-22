import 'react-native';
import React from 'react';
import { View } from 'react-native';
import { shallow } from 'enzyme';
import UserStore from '../../src/auth/UserStore';

import { activitiesServiceFaker } from '../../__mocks__/fake/ActivitiesFaker';

import BoostActionBar from '../../src/boost/BoostActionBar';
import MText from '../../src/common/components/MText';
// prevent double tap in touchable
jest.mock('../../src/boost/BoostStore');
jest.mock('../../src/auth/UserStore');

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
        entity={entity}
        boost={boost}
        user={userStore}
        navigation={navigation}
      />,
    );

    jest.runAllTimers();
  });

  it('renders correctly', async () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });

  it('renders the expected views', async () => {
    screen.update();
    expect(screen.find(View)).toHaveLength(3);
  });

  it('renders the expected text', async () => {
    screen.update();
    expect(screen.find(MText).at(0).dive().childAt(0).text()).toBe('$1.00');
  });
});
