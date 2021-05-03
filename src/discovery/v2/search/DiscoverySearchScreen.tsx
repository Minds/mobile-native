import React, { useEffect, useCallback } from 'react';
import { Text, View } from 'react-native';
import { observer } from 'mobx-react';

import SearchView from '../../../common/components/SearchView';
import { CommonStyle as CS } from '../../../styles/Common';

import testID from '../../../common/helpers/testID';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import { useNavigation } from '@react-navigation/core';
import { RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../../../navigation/NavigationTypes';
import { StackNavigationProp } from '@react-navigation/stack';
import { Icon } from 'react-native-elements';
import { DiscoverySearchList } from './DiscoverySearchList';
import { useDiscoveryV2SearchStore } from './DiscoveryV2SearchContext';
import TopbarTabbar from '../../../common/components/topbar-tabbar/TopbarTabbar';
import { GOOGLE_PLAY_STORE } from '../../../config/Config';
import DisabledStoreFeature from '../../../common/components/DisabledStoreFeature';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  route: RouteProp<AppStackParamList, 'DiscoverySearch'>;
}

export const DiscoverySearchHeader = observer(() => {
  const theme = ThemedStyles.style;
  const store = useDiscoveryV2SearchStore();
  const insets = useSafeAreaInsets();
  const paddingTop = { paddingTop: insets.top };
  const navigation = useNavigation<
    StackNavigationProp<AppStackParamList, 'DiscoverySearch'>
  >();

  const onPressBack = useCallback(() => {
    store.reset();
    navigation.goBack();
  }, [navigation, store]);

  return (
    <View style={[CS.shadow, theme.backgroundPrimary, paddingTop]}>
      <View style={[theme.rowJustifyStart, theme.alignCenter]}>
        <View style={theme.padding2x}>
          <Icon
            color={ThemedStyles.getColor('icon')}
            size={32}
            name="chevron-left"
            type="material-community"
            onPress={onPressBack}
          />
        </View>
        {
          //@ts-ignore
          <SearchView
            placeholder={i18n.t('discovery.search')}
            onChangeText={store.setQuery}
            value={store.query}
            containerStyle={[
              theme.marginVertical,
              theme.marginRight4x,
              theme.backgroundSecondary,
              theme.flexContainer,
            ]}
            // iconRight={iconRight}
            // iconRightOnPress={this.clearSearch}
            {...testID('Discovery Search Input')}
          />
        }
      </View>
      <TopbarTabbar
        current={store.filter}
        onChange={store.setFilter}
        tabs={[
          { id: 'top', title: 'Top' },
          { id: 'latest', title: 'Latest' },
          { id: 'channels', title: i18n.t('discovery.channels') },
          { id: 'groups', title: i18n.t('discovery.groups') },
        ]}
      />
    </View>
  );
});

/**
 * Discovery screen
 */
export const DiscoverySearchScreen = observer((props: Props) => {
  const theme = ThemedStyles.style;
  const store = useDiscoveryV2SearchStore();

  const navigation = useNavigation<
    StackNavigationProp<AppStackParamList, 'DiscoverySearch'>
  >();
  navigation.setOptions({
    headerShown: false,
  });

  useEffect(() => {
    const q = decodeURIComponent(props.route.params?.q || '');
    const query = props.route.params.query || q;
    if (props.route.params.f) {
      store.setFilter(props.route.params.f);
    }
    store.setQuery(query, props.route.params.plus);
  }, [store, props.route.params]);

  return (
    <View style={theme.flexContainer}>
      <DiscoverySearchHeader />
      {GOOGLE_PLAY_STORE ? (
        <DisabledStoreFeature style={theme.flexContainer} />
      ) : (
        <DiscoverySearchList
          navigation={navigation}
          style={theme.flexContainer}
        />
      )}
    </View>
  );
});
