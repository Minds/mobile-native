import 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';

import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';
import RemindOwnerBlock from '../../../src/newsfeed/activity/RemindOwnerBlock';
import ActivityModel from '../../../src/newsfeed/ActivityModel';
import { getStores } from '../../../AppStores';

getStores.mockReturnValue({
  user: {
    me: {},
    load: jest.fn(),
    setUser: jest.fn(),
  },
});

describe('Remind owner component', () => {
  let entity, screen, navigation;

  beforeEach(() => {
    entity = ActivityModel.create(
      activitiesServiceFaker().load(1).activities[0],
    );
    navigation = {
      navigate: jest.fn(),
      push: jest.fn(),
    };

    screen = shallow(
      <RemindOwnerBlock entity={entity} navigation={navigation} />,
    );
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
    let touchables = screen.find('TouchableOpacity');
    touchables.at(0).props().onPress();

    expect(navigation.push).toHaveBeenCalledWith('Channel', {
      entity: entity.ownerObj,
      guid: entity.ownerObj.guid,
    });

    expect(screen.find(TouchableOpacity)).toHaveLength(2);
  });
});
