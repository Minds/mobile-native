import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';

import { activitiesServiceFaker } from '../../../../__mocks__/fake/ActivitiesFaker';

import renderer from 'react-test-renderer';
import ThumbUpAction from '../../../../src/newsfeed/activity/actions/ThumbUpAction';

import withPreventDoubleTap from '../../../../src/common/components/PreventDoubleTap';
import featuresService from '../../../../src/common/services/features.service';
import UserStore from '../../../../src/auth/UserStore';
import ActivityModel from '../../../../src/newsfeed/ActivityModel';
jest.mock('../../../../src/auth/UserStore');

describe('Thumb action component', () => {
  let screen, entity;
  beforeEach(() => {
    const TouchableOpacityCustom = <TouchableOpacity onPress={this.onPress} />;

    const navigation = { navigate: jest.fn() };
    let activityResponse = activitiesServiceFaker().load(1);

    entity = ActivityModel.create(activityResponse.activities[0]);

    screen = shallow(<ThumbUpAction entity={entity} navigation={navigation} />);
  });

  it('renders correctly', async () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });

  it('should have an action button', async () => {
    screen.update();
    expect(screen.find('AnimatedThumb')).toHaveLength(1);
  });

  it('should navigate a thumb on press ', () => {
    const navigation = {
      navigate: jest.fn(),
    };

    entity.toggleVote = jest.fn();

    screen = shallow(<ThumbUpAction entity={entity} navigation={navigation} />);
    screen.update();
    let touchables = screen.find('preventDoubleTap(PressableScale)');
    touchables.at(0).props().onPress();

    expect(entity.toggleVote).toHaveBeenCalled();

    expect(touchables).toHaveLength(1);
  });
});
