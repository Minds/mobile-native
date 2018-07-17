import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';


import ActionSheet from 'react-native-actionsheet';
import * as Progress from 'react-native-progress';

import Activity from '../../../src/newsfeed/activity/Activity';

import { commentsServiceFaker } from '../../../__mocks__/fake/CommentsFaker';
import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';

import renderer from 'react-test-renderer';
import ExplicitText from '../../../src/common/components/explicit/ExplicitText';
import OwnerBlock from '../../../src/newsfeed/activity/OwnerBlock';
import Actions from '../../../src/newsfeed/activity/Actions';
import ActivityEditor from '../../../src/newsfeed/activity/ActivityEditor';
import RemindOwnerBlock from '../../../src/newsfeed/activity/RemindOwnerBlock';
import ActivityActionSheet from '../../../src/newsfeed/activity/ActivityActionSheet';
import ActivityMetrics from '../../../src/newsfeed/activity/metrics/ActivityMetrics';
import AutoHeightFastImage from '../../../src/common/components/AutoHeightFastImage';

import formatDate from '../../../src/common/helpers/date';
import domain from '../../../src/common/helpers/domain';
import MediaView from '../../../src/common/components/MediaView';

import Lock from '../../../src/wire/lock/Lock';
import ActivityModel from '../../../src/newsfeed/ActivityModel';

jest.mock('../../../src/common/components/Translate', () => 'Translate');
jest.mock('../../../src/common/components/explicit/ExplicitText', () => 'ExplicitText');
jest.mock('../../../src/newsfeed/activity/OwnerBlock', () => 'OwnerBlock');
jest.mock('../../../src/newsfeed/activity/Actions', () => 'Actions');
jest.mock('../../../src/newsfeed/activity/ActivityEditor', () => 'ActivityEditor');
jest.mock('../../../src/newsfeed/activity/RemindOwnerBlock', () => 'RemindOwnerBlock');
jest.mock('../../../src/newsfeed/activity/ActivityActionSheet', () => 'ActivityActionSheet');
jest.mock('../../../src/newsfeed/activity/metrics/ActivityMetrics', () => 'ActivityMetrics');

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
    const render = screen.dive();
    render.find('TouchableOpacity').forEach(child => {
      child.simulate('press');
    });
    jest.runAllTimers();

    expect(spy).toHaveBeenCalled();
  });


});
