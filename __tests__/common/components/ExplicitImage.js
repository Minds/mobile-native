import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';
import ExplicitImage from '../../../src/common/components/explicit/ExplicitImage';

import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';

import renderer from 'react-test-renderer';

describe('Explicit image component', () => {

  let user, comments, entity, screen;
  beforeEach(() => {

    let mockResponse = activitiesServiceFaker().load(1);
    entity = mockResponse.activities[0];
    entity.mature = true;
    screen = shallow(
      <ExplicitImage entity={entity}/>
    );

    jest.runAllTimers();
  });

  it('renders correctly', async () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });

  it('should have a ExplicitOverlay', async () => {
    screen.update();

    expect(screen.find('ExplicitOverlay')).toHaveLength(1);
  });


  it('sholdnt show overlay if press', async () => {
    let mockResponse = activitiesServiceFaker().load(1);
    entity = mockResponse.activities[0];
    entity.mature = false;
    screen = shallow(
      <ExplicitImage entity={entity}/>
    );
    screen.update();
    expect(screen.find('ExplicitOverlay')).toHaveLength(0);
  });
});
