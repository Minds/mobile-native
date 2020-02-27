import 'react-native';
import React from 'react';
import MindsVideo from '../../src/media/MindsVideo';
import { activitiesServiceFaker } from '../../__mocks__/fake/ActivitiesFaker';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import ActivityModel from '../../src/newsfeed/ActivityModel';

jest.mock('react-native-video');
jest.mock('../../src/navigation/NavigationService');
/**
 * Tests
 */
describe('Messenger setup component', () => {
  let activity;

  beforeEach(() => {
    activity = activitiesServiceFaker().load(1).activities[0];
  });

  it('should renders correctly with source', async () => {
    const video = renderer
      .create(
        <MindsVideo source={{ uri: 'https//www.minds.com/somevidep.mp4' }} />,
      )
      .toJSON();

    expect(video).toMatchSnapshot();
  });

  it('should renders correctly with entity', async () => {
    const video = renderer
      .create(<MindsVideo entity={ActivityModel.create(activity)} />)
      .toJSON();

    expect(video).toMatchSnapshot();
  });
});
