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

    jest.runTimersToTime(1000);
  });

  it('renders correctly', async () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });
});
