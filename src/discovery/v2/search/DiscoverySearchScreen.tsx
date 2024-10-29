import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';

import { useNavigation } from '@react-navigation/core';
import { RouteProp } from '@react-navigation/native';
import { DiscoveryStackParamList } from '~/navigation/DiscoveryStack';
import { StackNavigationProp } from '@react-navigation/stack';
import { DiscoverySearchList } from './DiscoverySearchList';
import { DiscoveryV2SearchStoreContext } from './DiscoveryV2SearchContext';
import { DiscoverySearchHeader } from './DiscoverySearchHeader';
import DiscoveryV2SearchStore, {
  DiscoveryV2SearchStoreAlgorithm,
} from './DiscoveryV2SearchStore';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { IS_IPAD } from '~/config/Config';
import CaptureFab from '~/capture/CaptureFab';
import sp from '~/services/serviceProvider';

interface Props {
  route: RouteProp<DiscoveryStackParamList, 'DiscoverySearch'>;
}

/**
 * Discovery screen
 */
export const DiscoverySearchScreen = withErrorBoundaryScreen(
  observer((props: Props) => {
    const theme = sp.styles.style;
    const store = useMemo(() => new DiscoveryV2SearchStore(), []);

    const navigation =
      useNavigation<
        StackNavigationProp<DiscoveryStackParamList, 'DiscoverySearch'>
      >();
    navigation.setOptions({
      headerShown: false,
    });

    useEffect(() => {
      const q = decodeURIComponent(props.route.params?.q ?? '');
      const { query = q, f, plus } = props.route.params ?? {};
      if (f) {
        store.setAlgorithm(f as DiscoveryV2SearchStoreAlgorithm);
      }
      store.setQuery(query, plus);
    }, [store, props.route.params]);

    return (
      <DiscoveryV2SearchStoreContext.Provider value={store}>
        <View style={theme.flexContainer}>
          <DiscoverySearchHeader />

          <DiscoverySearchList
            navigation={navigation}
            style={theme.flexContainer}
          />
        </View>
        {!IS_IPAD && <CaptureFab navigation={navigation} />}
      </DiscoveryV2SearchStoreContext.Provider>
    );
  }),
  'DiscoverySearchScreen',
);
