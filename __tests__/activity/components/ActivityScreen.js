import 'react-native';
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';

import ActivityScreen from '../../../src/newsfeed/ActivityScreen';
import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';
import entitiesService from '../../../src/common/services/entities.service';
import ActivityModel from '../../../src/newsfeed/ActivityModel';
import { useNavigation } from '../../../__mocks__/@react-navigation/native';
import { getStores } from '../../../AppStores';

getStores.mockReturnValue({
  newsfeed: {},
});

jest.mock('react-native-safe-area-context');
jest.mock('react-native-material-menu');
jest.mock('@react-navigation/native');
jest.mock('react-native-gesture-handler');
jest.mock('react-native-redash');
jest.mock('../../../src/common/components/KeyboardSpacingView');
jest.mock('reanimated-bottom-sheet', () => 'BottomSheet');

jest.mock('../../../src/newsfeed/NewsfeedService');
jest.mock('../../../src/newsfeed/activity/Activity', () => 'Activity');
jest.mock('../../../src/comments/CommentList', () => 'CommentList');
jest.mock(
  '../../../src/common/components/CenteredLoading',
  () => 'CenteredLoading',
);
jest.mock('../../../src/comments/CommentsStore');
jest.mock('../../../src/comments/CommentsStoreProvider');
jest.mock('../../../src/common/services/entities.service');
jest.mock('../../../src/common/hooks/use-stores');

// react testing library has a problem with the fake timers
// https://github.com/callstack/react-native-testing-library/issues/391
jest.useRealTimers();

describe('Activity screen component', () => {
  it('renders correctly ', async (done) => {
    const navigation = {
      push: jest.fn(),
      goBack: jest.fn(),
    };
    useNavigation.mockReturnValue(navigation);

    const route = {
      routeName: 'some',
      params: { entity: activitiesServiceFaker().load(1).activities[0] },
    };

    entitiesService.single.mockResolvedValue(
      ActivityModel.create(route.params.entity),
    );

    const { toJSON, getByA11yLabel } = render(
      <ActivityScreen navigation={navigation} route={route} />,
    );

    await waitFor(() => getByA11yLabel('touchableTextCopy'), {
      timeout: 4000,
      interval: 100,
    });

    // should show the activity
    expect(toJSON()).toMatchSnapshot();

    done();
  });
});
