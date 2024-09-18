import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from 'react-native-elements';
import { observer } from 'mobx-react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import TopbarTabbar from '~/common/components/topbar-tabbar/TopbarTabbar';
import testID from '~/common/helpers/testID';
import SearchView from '~/common/components/SearchView';
import { useDiscoveryV2SearchStore } from './DiscoveryV2SearchContext';

import FeedFilter from '~/common/components/FeedFilter';
import { DiscoveryV2SearchStoreAlgorithm } from './DiscoveryV2SearchStore';
import { DiscoveryStackParamList } from '~/navigation/DiscoveryStack';
import sp from '~/services/serviceProvider';

type NavigationType = StackNavigationProp<
  DiscoveryStackParamList,
  'DiscoverySearch'
>;

export const DiscoverySearchHeader = observer(() => {
  const store = useDiscoveryV2SearchStore();
  const insets = useSafeAreaInsets();
  const paddingTop = { paddingTop: insets.top };
  const navigation = useNavigation<NavigationType>();

  const onPressBack = React.useCallback(() => {
    store.reset();
    navigation.goBack();
  }, [navigation, store]);
  const i18n = sp.i18n;

  const tabs: { id: DiscoveryV2SearchStoreAlgorithm; title: string }[] = [
    { id: 'top', title: 'Top' },
    { id: 'latest', title: 'Latest' },
    { id: 'channels', title: i18n.t('discovery.channels') },
    { id: 'groups', title: i18n.t('discovery.filters.groups') },
  ];

  const shouldRenderFilter = ['top', 'latest'].includes(store.algorithm);

  return (
    <View style={[styles.mainContainer, paddingTop]}>
      <View style={styles.secondaryContainer}>
        <View style={styles.iconContainer}>
          <Icon
            color={sp.styles.getColor('Icon')}
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
            onChangeText={store.setQuery as any}
            value={store.query}
            containerStyle={styles.searchView}
            {...testID('Discovery Search Input')}
          />
        }
      </View>
      <View style={styles.topbarContainer}>
        <TopbarTabbar
          current={store.algorithm}
          onChange={store.setAlgorithm}
          tabs={tabs}
          containerStyle={styles.topbarTabbar}
        />
        {shouldRenderFilter && (
          <FeedFilter
            nsfw
            store={store}
            containerStyles={styles.feedFilterContainer}
            textStyle={sp.styles.style.colorSecondaryText}
          />
        )}
      </View>
    </View>
  );
});

const shadow = {
  elevation: 4,
  shadowOffset: { width: 0, height: 2 },
  shadowColor: 'black',
  shadowOpacity: 0.1,
  shadowRadius: 2,
};

const styles = sp.styles.create({
  mainContainer: ['bgPrimaryBackground', shadow],
  secondaryContainer: ['rowJustifyStart', 'alignCenter'],
  iconContainer: ['padding2x'],
  feedFilterContainer: [
    'paddingHorizontal2x',
    'bgPrimaryBackground',
    {
      alignItems: 'center',
      bottom: 1,
    },
  ],
  topbarContainer: ['rowStretch', 'borderBottom', 'bcolorPrimaryBorder'],
  topbarTabbar: {
    borderBottomWidth: 0,
  },
  searchView: [
    'marginVertical',
    'marginRight4x',
    'bgSecondaryBackground',
    'flexContainer',
  ],
});
