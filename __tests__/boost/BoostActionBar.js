import 'react-native';
import React from 'react';
import { View, Text, TouchableHighlight } from "react-native";
import { shallow } from 'enzyme';
import UserStore from '../../src/auth/UserStore';

import { activitiesServiceFaker } from '../../__mocks__/fake/ActivitiesFaker';

import renderer from 'react-test-renderer';
import BoostActionBar from '../../src/boost/BoostActionBar';
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
        list:[]
    };
    entity.bidType = 'usd';
    entity.bid = 100;
    const userStore = new UserStore();
    screen = shallow(
      <BoostActionBar.wrappedComponent entity={entity} boost={boost} user={userStore} navigation={navigation} />
    );

    jest.runAllTimers();
  });

  it('renders correctly', async () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });

  it('renders the expected views', async () => {
    screen.update();
    let render = screen.dive();
    expect(screen.find(View)).toHaveLength(5);
  });

  it('renders the expected text', async () => {
    screen.update();
    let render = screen.dive();
    expect(screen.find(Text).at(0).dive().text()).toBe('$1.00');
  });

});
