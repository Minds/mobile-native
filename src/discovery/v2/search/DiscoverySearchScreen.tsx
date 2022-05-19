import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import ThemedStyles from '../../../styles/ThemedStyles';
import { useNavigation } from '@react-navigation/core';
import { RouteProp } from '@react-navigation/native';
import { DiscoveryStackParamList } from '../../../navigation/NavigationTypes';
import { StackNavigationProp } from '@react-navigation/stack';
import { DiscoverySearchList } from './DiscoverySearchList';
import { DiscoveryV2SearchStoreContext } from './DiscoveryV2SearchContext';
import { DiscoverySearchHeader } from './DiscoverySearchHeader';
import DiscoveryV2SearchStore from './DiscoveryV2SearchStore';

interface Props {
  route: RouteProp<DiscoveryStackParamList, 'DiscoverySearch'>;
}

/**
 * Discovery screen
 */
export const DiscoverySearchScreen = observer((props: Props) => {
  const theme = ThemedStyles.style;
  const store = useMemo(() => new DiscoveryV2SearchStore(), []);

  const navigation = useNavigation<
    StackNavigationProp<DiscoveryStackParamList, 'DiscoverySearch'>
  >();
  navigation.setOptions({
    headerShown: false,
  });

  useEffect(() => {
    const q = decodeURIComponent(props.route.params?.q || '');
    const query = props.route.params.query || q;
    if (props.route.params.f) {
      store.setAlgorithm(props.route.params.f);
    }
    store.setQuery(query, props.route.params.plus);
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
    </DiscoveryV2SearchStoreContext.Provider>
  );
});
