import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';

import Activity from '../../../src/newsfeed/activity/Activity';

import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';

import ExplicitText from '../../../src/common/components/explicit/ExplicitText';
import OwnerBlock from '../../../src/newsfeed/activity/OwnerBlock';
import Actions from '../../../src/newsfeed/activity/Actions';
import ActivityMetrics from '../../../src/newsfeed/activity/metrics/ActivityMetrics';

import MediaView from '../../../src/common/components/MediaView';

import ActivityModel from '../../../src/newsfeed/ActivityModel';

jest.mock('../../../src/common/components/Translate', () => 'Translate');
jest.mock('../../../src/common/components/explicit/ExplicitText', () => 'ExplicitText');
jest.mock('../../../src/newsfeed/activity/OwnerBlock', () => 'OwnerBlock');
jest.mock('../../../src/newsfeed/activity/Actions', () => 'Actions');
jest.mock('../../../src/newsfeed/activity/ActivityEditor', () => 'ActivityEditor');
jest.mock('../../../src/newsfeed/activity/RemindOwnerBlock', () => 'RemindOwnerBlock');
jest.mock('../../../src/newsfeed/activity/ActivityActionSheet', () => 'ActivityActionSheet');
jest.mock('../../../src/newsfeed/activity/metrics/ActivityMetrics', () => 'ActivityMetrics');
jest.mock('../../../AppStores');

describe('Activity component', () => {

  let user, comments, entity, screen;
  beforeEach(() => {

    const navigation = { navigate: jest.fn() };
    let activityResponse = activitiesServiceFaker().load(1);

    const model = ActivityModel.create(activityResponse.activities[0]);

    screen = shallow(
      <Activity entity={model} navigation={navigation} />
    );

    jest.runAllTimers();
  });

  it('renders correctly', async () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });


  it('should have a Media View', async () => {
    screen.update();

    expect(screen.find(MediaView)).toHaveLength(1);
  });

  it('should have the expectedComponents', async () => {
    screen.update();

    expect(screen.find(MediaView)).toHaveLength(1);
    expect(screen.find(Actions)).toHaveLength(1);
    expect(screen.find(OwnerBlock)).toHaveLength(1);
    expect(screen.find(ExplicitText)).toHaveLength(1);
    expect(screen.find(ActivityMetrics)).toHaveLength(1);
    expect(screen.find(TouchableOpacity)).toHaveLength(1);
  });


  it('should navToActivity on press', () => {
    screen.update()
    let instance = screen.instance();
    const spy = jest.spyOn(instance, 'navToActivity');
    screen.find('TouchableOpacity').forEach(child => {
      child.simulate('press');
    });
    jest.runAllTimers();

    expect(spy).toHaveBeenCalled();
  });


});
