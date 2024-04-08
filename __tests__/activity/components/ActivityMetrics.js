import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';

import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';

import renderer from 'react-test-renderer';
import ActivityMetrics from '../../../src/newsfeed/activity/metrics/ActivityMetrics';

jest.mock('../../../src/auth/UserStore');
jest.mock('~/common/services/analytics.service');

describe('activity metrics component', () => {
  let screen, user;
  beforeEach(() => {
    let activityResponse = activitiesServiceFaker().load(1);
    let activity = activityResponse.activities[0];
    activity.wire_totals = { tokens: 20 };
    activity.impressions = 20;
    screen = renderer.create(<ActivityMetrics entity={activity} />);
  });

  it('renders correctly', async () => {
    expect(screen).toMatchSnapshot();
  });

  it('should have Text', async () => {
    let root = screen.root;
    expect(root.findAllByType('Text')).toHaveLength(1);
  });
});
