import 'react-native';
import React from 'react';
import { Text, TouchableHighlight } from "react-native";
import { shallow } from 'enzyme';

import { activitiesServiceFaker } from '../../../../__mocks__/fake/ActivitiesFaker';

import renderer from 'react-test-renderer';
import BoostAction from '../../../../src/newsfeed/activity/actions/BoostAction';

import withPreventDoubleTap from '../../../../src/common/components/PreventDoubleTap';

import featuresService from '../../../../src/common/services/features.service';

// prevent double tap in touchable

describe('Boost action component', () => {

  let screen;
  beforeEach(() => {

    const TouchableHighlightCustom = <TouchableHighlight onPress={this.onPress} />;

    const navigation = { navigate: jest.fn() };
    let activityResponse = activitiesServiceFaker().load(1);
    screen = shallow(
      <BoostAction entity={activityResponse.activities[0]} navigation={navigation} />
    );

    jest.runAllTimers();
  });

  it('renders correctly', async () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });


  it('should have A boost button', async () => {
    screen.update();
    expect(screen.find('Text').dive().text()).toBe('BOOST');
  });

  it('should navigate to boost on press ', () => {
    let activityResponse = activitiesServiceFaker().load(1);

    const navigation = { 
      navigate: jest.fn() 
    };
    let entity = activityResponse.activities[0];
    screen = shallow(
      <BoostAction entity={entity} navigation={navigation}/>
    );
    screen.update()
    let render = screen.dive();
    let touchables = render.find('PreventDoubleTap');
    touchables.at(0).props().onPress();
    jest.runAllTimers();

    expect(navigation.navigate).toHaveBeenCalled();

    expect(screen.find('PreventDoubleTap')).toHaveLength(1);

  });

});
