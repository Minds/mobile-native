import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';

import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';

import renderer from 'react-test-renderer';
import ActivityMetrics from '../../../src/newsfeed/activity/metrics/ActivityMetrics';

import UserStore from '../../../src/auth/UserStore';

import abbrev from '../../../src/common/helpers/abbrev';
import token from '../../../src/common/helpers/token';

jest.mock('../../../src/auth/UserStore');

describe('Owner component', () => {

  let screen, user;
  beforeEach(() => {

    user = new UserStore();
    let activityResponse = activitiesServiceFaker().load(1);
    let activity = activityResponse.activities[0];
    activity.wire_totals = { tokens: 20};
    activity.impressions = 20;
    screen = shallow(
      <ActivityMetrics.wrappedComponent entity={activity} user={user}/>
    );

    jest.runAllTimers();
  });

  it('renders correctly', async () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });

  it('should have Text', async () => {
    screen.update();
    let render = screen.dive();
    expect(render.find('Text')).toHaveLength(6);
  });


});
