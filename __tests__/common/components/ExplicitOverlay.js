import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';
import ExplicitOverlay from '../../../src/common/components/explicit/ExplicitOverlay';

import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';

import renderer from 'react-test-renderer';

describe('Explicit overlay component', () => {

  let user, comments, entity, screen;
  beforeEach(() => {

    let mockResponse = activitiesServiceFaker().load(1);
    entity = mockResponse.activities[0];
    
    entity.mature_visibility = true;
    screen = shallow(
      <ExplicitOverlay entity={entity}/>
    );

    jest.runAllTimers();
  });

  it('renders correctly', async () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });

  it('should have a TouchableOpacity', async () => {
    screen.update();

    expect(screen.find('TouchableOpacity')).toHaveLength(1);
  });


  it('change visibility', async () => {
    let mockResponse = activitiesServiceFaker().load(1);
    entity = mockResponse.activities[0];
    entity.mature_visibility = true;
    entity.toggleMatureVisibility = jest.fn();
    screen = shallow(
      <ExplicitOverlay entity={entity}/>
    );

    screen.find('TouchableOpacity').simulate('press');
    screen.update();

    expect(entity.toggleMatureVisibility).toHaveBeenCalled();
  });
});
