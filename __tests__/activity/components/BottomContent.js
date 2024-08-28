import 'react-native';
import React from 'react';
import BottomContent from '~/newsfeed/activity/BottomContent';
import Actions from '~/newsfeed/activity/Actions';
import Scheduled from '~/newsfeed/activity/banners/Scheduled';
import Pending from '~/newsfeed/activity/banners/Pending';
import ActivityModel from '~/newsfeed/ActivityModel';
import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';
import { shallow } from 'enzyme';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');
sp.mockService('analytics');
const sessionService = sp.mockService('session');

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
    expect(screen.find(Actions)).toHaveLength(1);
    expect(screen.find(Scheduled)).toHaveLength(1);
    expect(screen.find(Pending)).toHaveLength(1);
  });
});
