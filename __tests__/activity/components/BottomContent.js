import 'react-native';
import React from 'react';
import BottomContent from '../../../src/newsfeed/activity/BottomContent';
import Actions from '../../../src/newsfeed/activity/Actions';
import Scheduled from '../../../src/newsfeed/activity/banners/Scheduled';
import Pending from '../../../src/newsfeed/activity/banners/Pending';
import ActivityMetrics from '../../../src/newsfeed/activity/metrics/ActivityMetrics';
import ActivityModel from '../../../src/newsfeed/ActivityModel';
import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';
import { shallow } from 'enzyme';
import { sessionService } from '~/common/services';

jest.mock('~/common/services/analytics.service');

describe('BottomContent component', () => {
  let model, navigation, screen;
  beforeEach(() => {
    const activityResponse = activitiesServiceFaker().load(1);
    model = ActivityModel.create(activityResponse.activities[0]);
    model.ownerObj.guid = sessionService.guid;
    screen = shallow(<BottomContent entity={model} />);
  });
  it('renders correctly', async () => {
    expect(screen).toMatchSnapshot();
  });
  it('should have the expectedComponents', async () => {
    expect(screen.find(ActivityMetrics)).toHaveLength(1);
    expect(screen.find(Actions)).toHaveLength(1);
    expect(screen.find(Scheduled)).toHaveLength(1);
    expect(screen.find(Pending)).toHaveLength(1);
  });
});
