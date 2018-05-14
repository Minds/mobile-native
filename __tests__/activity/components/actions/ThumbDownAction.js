import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';

import { activitiesServiceFaker } from '../../../../__mocks__/fake/ActivitiesFaker';

import renderer from 'react-test-renderer';
import ThumbDownAction from '../../../../src/newsfeed/activity/actions/ThumbDownAction';

import withPreventDoubleTap from '../../../../src/common/components/PreventDoubleTap';
import featuresService from '../../../../src/common/services/features.service';
import UserStore from '../../../../src/auth/UserStore';

jest.mock('../../../../src/auth/UserStore');
// prevent double tap in touchable

describe('Thumb action component', () => {

  let screen;
  beforeEach(() => {

    const TouchableOpacityCustom = <TouchableOpacity onPress={this.onPress} />;

    const navigation = { navigate: jest.fn() };
    let activityResponse = activitiesServiceFaker().load(1);
    screen = shallow(
      <ThumbDownAction entity={activityResponse.activities[0]} navigation={navigation} />
    );

    jest.runAllTimers();
  });

  it('renders correctly', async () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });


  it('should have A boost button', async () => {
    screen.update();
    expect(screen.find('Icon')).toHaveLength(1)
  });

  it('should navigate a thumb on press ', () => {
    let activityResponse = activitiesServiceFaker().load(1);

    const navigation = { 
      navigate: jest.fn() 
    };
    let entity = activityResponse.activities[0];
    entity.toggleVote = jest.fn();
    entity.votedUp = true;
    screen = shallow(
      <ThumbDownAction entity={entity} navigation={navigation}/>
    );
    screen.update();
    let touchables = screen.find('PreventDoubleTap');
    touchables.at(0).props().onPress();
    jest.runAllTimers();

    expect(entity.toggleVote).toHaveBeenCalled();

    expect(screen.find('PreventDoubleTap')).toHaveLength(1);

  });

});
