import 'react-native';
import React from 'react';
import { TouchableHighlight } from 'react-native';
import { shallow } from 'enzyme';

import { activitiesServiceFaker } from '../../../../__mocks__/fake/ActivitiesFaker';

import renderer from 'react-test-renderer';
import BoostAction from '../../../../src/newsfeed/activity/actions/BoostAction';

// prevent double tap in touchable

describe('Boost action component', () => {
  let screen;
  beforeEach(() => {
    const navigation = { navigate: jest.fn() };
    let activityResponse = activitiesServiceFaker().load(1);
    screen = renderer.create(
      <BoostAction
        entity={activityResponse.activities[0]}
        navigation={navigation}
      />,
    );

    jest.runAllTimers();
  });

  it('renders correctly', async () => {
    expect(screen).toMatchSnapshot();
  });

  xit('should have A boost button', async () => {
    expect(screen.root.findByType('Text').props['children']).toBe('Boost');
  });

  it('should navigate to boost on press ', () => {
    let activityResponse = activitiesServiceFaker().load(1);

    const navigation = {
      navigate: jest.fn(),
      push: jest.fn(),
    };
    let entity = activityResponse.activities[0];
    screen = shallow(<BoostAction entity={entity} navigation={navigation} />);
    screen.update();
    let touchables = screen.find('preventDoubleTap(TouchableHighlight)');
    touchables.at(0).props().onPress();
    jest.runAllTimers();

    expect(navigation.push).toHaveBeenCalled();

    expect(screen.find('preventDoubleTap(TouchableHighlight)')).toHaveLength(1);
  });
});
