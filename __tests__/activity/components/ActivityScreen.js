import 'react-native';
import React from 'react';
import { render, waitFor, screen } from '@testing-library/react-native';

import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';
import ActivityModel from '~/newsfeed/ActivityModel';
import {
  useNavigation,
  useRoute,
} from '../../../__mocks__/@react-navigation/native';
import { getStores } from '../../../AppStores';
import sp from '~/services/serviceProvider';
import { ActivityScreen } from '~/newsfeed/ActivityScreen';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');
sp.mockService('metadata');
const analytics = sp.mockService('analytics');
sp.mockService('newsfeed');
sp.mockService('i18n');
sp.mockService('richEmbed');
const permissions = sp.mockService('permissions');
sp.mockService('videoPlayer');
sp.mockService('api');
sp.mockService('feed');
sp.mockService('translation');
const session = sp.mockService('session');
sp.mockService('log');
const NavigationService = sp.mockService('navigation');
const entitiesService = sp.mockService('entities');

analytics.buildEntityContext.mockReturnValue({});
analytics.buildClientMetaContext.mockReturnValue({});

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
jest.mock('~/common/components/keyboard/KeyboardSpacingView');
jest.mock('@gorhom/bottom-sheet', () => {
  const react = require('react-native');

  return {
    BottomSheetFlatList: react.FlatList,
    TouchableOpacity: react.TouchableOpacity,
  };
});

jest.mock('~/newsfeed/activity/Activity', () => 'Activity');
jest.mock('~/common/components/CenteredLoading', () => 'CenteredLoading');
// jest.mock('~/comments/CommentsStore');
// jest.mock('~/comments/CommentsStoreProvider');
jest.mock('~/common/hooks/use-stores');
jest.mock('~/comments/v2/CommentBottomSheet', () => 'CommentBottomSheet');
jest.mock(
  '~/common/components/interactions/InteractionsBottomSheet',
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
      session.getUser.mockReturnValue({ id: '1' });
      permissions.canInteract.mockReturnValue(true);
      permissions.canBoost.mockReturnValue(true);
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
