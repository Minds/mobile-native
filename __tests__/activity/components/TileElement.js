import 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';

import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';

import TileElement from '../../../src/newsfeed/TileElement';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

describe('Owner component', () => {
  let screen, navigation;
  beforeEach(() => {
    navigation = { navigate: jest.fn(), push: jest.fn() };

    let activityResponse = activitiesServiceFaker().load(1);
    let entity = activityResponse.activities[0];
    entity.getThumbSource = jest.fn();
    entity.getThumbSource.mockReturnValue({
      uri: 'https://www.minds.com/image',
    });

    screen = shallow(
      <TileElement entity={entity} navigation={navigation} size={30} />,
    );
  });

  it('renders correctly', async () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });

  it('should have Touchableopacity', async () => {
    screen.update();
    expect(screen.find(TouchableOpacity)).toHaveLength(1);
  });

  it('should _navToChannel on press ', () => {
    let activityResponse = activitiesServiceFaker().load(1);
    let entity = activityResponse.activities[0];
    entity.getThumbSource = jest.fn();
    entity.getThumbSource.mockReturnValue({
      uri: 'https://www.minds.com/image',
    });
    screen = shallow(
      <TileElement entity={entity} navigation={navigation} size={30} />,
    );
    screen.update();
    let touchables = screen.find('TouchableOpacity');
    touchables.at(0).props().onPress();

    expect(navigation.push).toHaveBeenCalledWith('Activity', {
      entity: entity,
    });
  });
});
