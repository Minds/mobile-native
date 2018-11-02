import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';

import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';

import renderer from 'react-test-renderer';
import RemindOwnerBlock from '../../../src/newsfeed/activity/RemindOwnerBlock';

import formatDate from '../../../src/common/helpers/date';
import domain from '../../../src/common/helpers/domain';

describe('Remind owner component', () => {

  let user, comments, entity, screen;
  beforeEach(() => {
    let activityResponse = activitiesServiceFaker().load(1);
    screen = shallow(
      <RemindOwnerBlock entity={activityResponse.activities[0]}/>
    );

    jest.runAllTimers();
  });

  it('renders correctly', async () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });


  it('should have Touchableopacity', async () => {
    screen.update();
    expect(screen.find(TouchableOpacity)).toHaveLength(2);
  });


  it('should _navToChannel on press ', () => {
    let activityResponse = activitiesServiceFaker().load(1);

    const navigation = {
      navigate: jest.fn(),
      push: jest.fn(),
    };
    let entity = activityResponse.activities[0];
    screen = shallow(
      <RemindOwnerBlock entity={entity} navigation={navigation} rightToolbar={null}/>
    );
    screen.update()
    let touchables = screen.find('TouchableOpacity');
    touchables.at(0).props().onPress();
    jest.runAllTimers();

    expect(navigation.push).toHaveBeenCalledWith('Channel', {'entity': entity.ownerObj, 'guid': entity.ownerObj.guid});


    expect(screen.find(TouchableOpacity)).toHaveLength(2);

  });

});
