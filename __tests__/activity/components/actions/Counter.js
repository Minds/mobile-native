import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';

import { activitiesServiceFaker } from '../../../../__mocks__/fake/ActivitiesFaker';

import renderer from 'react-test-renderer';
import Counter from '../../../../src/newsfeed/activity/actions/Counter';

describe('Owner component', () => {

  let screen;
  beforeEach(() => {

    const navigation = { navigate: jest.fn() };
    screen = shallow(
      <Counter count={100} />
    );

    jest.runAllTimers();
  });

  it('renders correctly', async () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });


  it('should have Text', async () => {
    screen.update();
    expect(screen.find('Text')).toHaveLength(1);
  });

  it('should _navToChannel on press ', () => {

    screen.update();
    let touchables = screen.find('Text');
    expect(touchables.at(0).dive().text()).toBe('100');

  });

});
