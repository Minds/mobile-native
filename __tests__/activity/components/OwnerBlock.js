import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';

import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';

import OwnerBlock from '../../../src/newsfeed/activity/OwnerBlock';
import ActivityModel from '../../../src/newsfeed/ActivityModel';
import { getStores } from '../../../AppStores';

getStores.mockReturnValue({
  user: {
    me: {},
    load: jest.fn(),
    setUser: jest.fn(),
  },
});
// const DebouncedTouchableOpacity = withPreventDoubleTap(TouchableOpacity);
xdescribe('Owner component', () => {
  let screen, entity, navigation;
  beforeEach(() => {
    navigation = { navigate: jest.fn(), push: jest.fn() };
    const activityResponse = activitiesServiceFaker().load(1, {
      guid: 1,
      name: 'group',
    });
    entity = ActivityModel.create(activityResponse.activities[0]);
    screen = shallow(
      <OwnerBlock
        entity={entity}
        navigation={navigation}
        rightToolbar={null}
      />,
    );
  });

  it('renders correctly', async () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });

  it('should have PreventDoubleTap', async () => {
    screen.update();
    expect(screen.find('preventDoubleTap(TouchableOpacity)')).toHaveLength(3);
  });

  it('should _navToChannel on press ', () => {
    let touchables = screen.find('preventDoubleTap(TouchableOpacity)');
    touchables.at(0).props().onPress();

    expect(navigation.push).toHaveBeenCalledWith('Channel', {
      entity: entity.ownerObj,
      guid: entity.ownerObj.guid,
    });
    expect(screen.find('preventDoubleTap(TouchableOpacity)')).toHaveLength(3);
  });

  it('should nav to groups on press ', () => {
    let touchables = screen.find('preventDoubleTap(TouchableOpacity)');

    expect(touchables).toHaveLength(3);
    //group touchable
    touchables.at(2).props().onPress();

    expect(navigation.push).toHaveBeenCalledWith('GroupView', {
      group: { guid: 1, name: 'group' },
    });
  });
});
