import 'react-native';
import React from 'react';
import { Pressable } from 'react-native';
import { shallow } from 'enzyme';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

sp.mockService('styles');
sp.mockService('session');

import Activity from '~/newsfeed/activity/Activity';

import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';

import ExplicitText from '~/common/components/explicit/ExplicitText';
import OwnerBlock from '~/newsfeed/activity/OwnerBlock';
import BottomContent from '~/newsfeed/activity/BottomContent';
import MediaView from '~/common/components/MediaView';
import ActivityModel from '~/newsfeed/ActivityModel';

jest.mock('~/common/services/session.service');
jest.mock('~/media/v2/mindsVideo/MindsVideo', () => 'MindsVideoV2');
jest.mock('~/common/components/explicit/ExplicitText', () => 'ExplicitText');
jest.mock('~/newsfeed/activity/OwnerBlock', () => 'OwnerBlock');
jest.mock('~/newsfeed/activity/Actions', () => 'Actions');

jest.mock(
  '~/newsfeed/activity/ActivityActionSheet',
  () => 'ActivityActionSheet',
);
jest.mock(
  '~/newsfeed/activity/metrics/ActivityMetrics',
  () => 'ActivityMetrics',
);

jest.mock('../../../AppStores');

jest.mock('~/common/contexts/analytics.context', () => ({
  withAnalyticsContext:
    mapper =>
    ({ children }) =>
      children,
}));

jest.mock('~/newsfeed/activity/contexts/Activity.context', () => ({
  withActivityContext:
    mapper =>
    ({ children }) =>
      children,
}));

jest.mock(
  '~/newsfeed/activity/hocs/undoable',
  () =>
    () =>
    ({ children }) =>
      children,
);

describe('Activity component', () => {
  let user, comments, entity, screen;
  beforeEach(() => {
    const navigation = { navigate: jest.fn(), push: jest.fn() };
    let activityResponse = activitiesServiceFaker().load(1);

    const model = ActivityModel.create(activityResponse.activities[0]);

    screen = shallow(<Activity entity={model} navigation={navigation} />);
  });

  it('renders correctly', async () => {
    expect(screen).toMatchSnapshot();
  });

  it('should have a Media View', async () => {
    expect(screen.find(MediaView)).toHaveLength(1);
  });

  it('should have the expectedComponents', async () => {
    screen.update();

    expect(screen.find(MediaView)).toHaveLength(1);
    expect(screen.find(BottomContent)).toHaveLength(1);
    expect(screen.find(OwnerBlock)).toHaveLength(1);
    expect(screen.find(ExplicitText)).toHaveLength(1);
    expect(screen.find(Pressable)).toHaveLength(1);
  });

  // it('should navToActivity on press', () => {
  //   // screen.update();
  //   let instance = screen.instance();
  //   const spy = jest.spyOn(instance, 'navToActivity');
  //   screen.find(TouchableOpacity).forEach((child) => {
  //     child.simulate('press');
  //   });

  //   expect(spy).toHaveBeenCalled();
  // });
});
