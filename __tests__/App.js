import 'react-native';
import React from 'react';
import App from '../App';
import { BackHandler } from 'react-native';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import { getStores } from '../AppStores';

jest.mock('../AppInitManager');
jest.mock('../FontsLoader');
jest.mock('../src/common/services/update.service.ts');
jest.mock('@react-navigation/native-stack');
jest.mock('react-native-exception-handler');

// mock backhandler
BackHandler.addEventListener = jest.fn();
jest.mock('../src/common/services/log.service', () => {});
jest.mock('../src/common/services/push.service');

jest.mock('../src/media/v2/mindsVideo/MindsVideo', () => 'MindsVideoV2');
jest.mock('../src/comments/v2/CommentBottomSheet', () => 'CommentBottomSheet');

//mock packages
jest.mock('react-native-share-menu');
jest.mock('@gorhom/bottom-sheet', () => {
  const react = require('react-native');

  return {
    BottomSheetFlatList: react.FlatList,
  };
});
jest.mock('react-native-notifications');
jest.mock('react-native-convert-ph-asset');
jest.mock('@react-navigation/native');
jest.mock('@react-navigation/bottom-tabs');
jest.mock('react-native-screens/native-stack');
jest.mock('react-native-file-share-intent');
jest.mock('react-native-safe-area-context');
jest.mock('../src/common/services/translation.service');

getStores.mockReturnValue({
  user: {
    me: {},
    load: jest.fn(),
    setUser: jest.fn(),
  },
});

it('renders correctly', () => {
  renderer.create(<App />);
});
