import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';

import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';

import renderer from 'react-test-renderer';
import ActivityMetrics from '../../../src/newsfeed/activity/metrics/ActivityMetrics';

import abbrev from '../../../src/common/helpers/abbrev';
import token from '../../../src/common/helpers/token';

jest.mock('../../../src/auth/UserStore');

describe('activity metrics component', () => {

  let screen, user;
  beforeEach(() => {

    let activityResponse = activitiesServiceFaker().load(1);
    let activity = activityResponse.activities[0];
    activity.wire_totals = { tokens: 20};
    activity.impressions = 20;
    screen = renderer.create(
      <ActivityMetrics entity={activity}/>
    );

    jest.runAllTimers();
  });

  it('renders correctly', async () => {
    expect(screen).toMatchSnapshot();
  });

  it('should have Text', async () => {
    let root = screen.root;
    expect(root.findAllByType('Text')).toHaveLength(5);
  });
});
