import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';
import ExplicitOverlay from '../../../src/common/components/explicit/ExplicitOverlay';
import ActivityModel from '../../../src/newsfeed/ActivityModel';
import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';
jest.mock('TouchableOpacity', () => 'TouchableOpacity');

describe('Explicit overlay component', () => {

  let entity, screen;
  beforeEach(() => {

    let mockResponse = activitiesServiceFaker().load(1);
    entity = ActivityModel.create(mockResponse.activities[0]);
    entity.mature_visibility = false;
    screen = shallow(
      <ExplicitOverlay entity={entity}/>
    );

    jest.runAllTimers();
  });

  it('renders correctly', async () => {
    expect(screen).toMatchSnapshot();
  });

  it('should renders the etag', async () => {
    entity.mature_visibility = true;
    await screen.update();

    expect(screen).toMatchSnapshot();
  });
});
