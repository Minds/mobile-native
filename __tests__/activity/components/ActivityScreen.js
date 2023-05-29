import 'react-native';
import React from 'react';
import { render, waitFor, screen } from '@testing-library/react-native';

import ActivityScreen from '../../../src/newsfeed/ActivityScreen';
import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';
import entitiesService from '../../../src/common/services/entities.service';
import ActivityModel from '../../../src/newsfeed/ActivityModel';
import NavigationService from '../../../src/navigation/NavigationService';
import {
  useNavigation,
  useRoute,
} from '../../../__mocks__/@react-navigation/native';
import { getStores } from '../../../AppStores';
jest.mock('react-native/Libraries/LogBox/LogBox');
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

getStores.mockReturnValue({
  newsfeed: {},
  user: { me: { id: '1' } },
});

jest.mock('react-native-safe-area-context');
jest.mock('react-native-material-menu');
jest.mock('@react-navigation/native');
jest.mock('react-native-gesture-handler');
jest.mock('react-native-redash');
jest.mock('../../../src/common/components/keyboard/KeyboardSpacingView');
jest.mock('@gorhom/bottom-sheet', () => {
  const react = require('react-native');

  return {
    BottomSheetFlatList: react.FlatList,
    TouchableOpacity: react.TouchableOpacity,
  };
});

jest.mock('../../../src/newsfeed/NewsfeedService');
jest.mock('../../../src/newsfeed/activity/Activity', () => 'Activity');
jest.mock(
  '../../../src/common/components/CenteredLoading',
  () => 'CenteredLoading',
);
// jest.mock('../../../src/comments/CommentsStore');
// jest.mock('../../../src/comments/CommentsStoreProvider');
jest.mock('../../../src/common/services/entities.service');
jest.mock('../../../src/navigation/NavigationService');
jest.mock('../../../src/common/hooks/use-stores');
jest.mock(
  '../../../src/comments/v2/CommentBottomSheet',
  () => 'CommentBottomSheet',
);
jest.mock(
  '../../../src/common/components/interactions/InteractionsBottomSheet',
  () => 'InteractionsBottomSheet',
);

// react testing library has a problem with the fake timers
// https://github.com/callstack/react-native-testing-library/issues/391
jest.useRealTimers();

describe('Activity screen component', () => {
  it('renders correctly ', async () => {
    try {
      const navigation = {
        push: jest.fn(),
        goBack: jest.fn(),
      };
      useNavigation.mockReturnValue(navigation);
      useRoute.mockReturnValue({ params: {} });
      NavigationService.getCurrentState.mockReturnValue({ params: {} });

      const entity = activitiesServiceFaker().load(1).activities[0];
      entity.can = jest.fn(() => true);

      const route = {
        routeName: 'some',
        params: { entity },
      };

      entitiesService.single.mockResolvedValue(
        ActivityModel.create(route.params.entity),
      );

      render(<ActivityScreen navigation={navigation} route={route} />);

      await waitFor(() => screen.getAllByLabelText('touchableTextCopy'), {
        timeout: 4000,
        interval: 100,
      });

      // should show the activity
      await expect(screen.toJSON()).toMatchSnapshot();
    } catch (e) {
      console.log(e);
      throw e;
    }
  });
});
