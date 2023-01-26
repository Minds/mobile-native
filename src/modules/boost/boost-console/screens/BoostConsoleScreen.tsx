import { NavigationProp, RouteProp } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useEffect, useRef } from 'react';
import { FlatList, View } from 'react-native';
import CenteredLoading from '~/common/components/CenteredLoading';
import { ComponentsStyle } from '~/styles/Components';
import ThemedStyles from '~/styles/ThemedStyles';
import { B1, Button, Icon, IconButton, Screen, ScreenHeader } from '~ui';
import { hasVariation } from '../../../../../ExperimentsProvider';
import { useTranslation } from '../../locales';
import BoostConsoleStore from '../boost-console.store';
import Boost from '../components/Boost';
import BoostTabBar from '../components/BoostTabBar';
import BoostV3 from '../components/v3/Boost';
import BoostTabBarV3 from '../components/v3/BoostTabBar';
import { BoostConsoleStoreContext } from '../contexts/boost-store.context';

interface BoostConsoleScreenProps {
  route: RouteProp<any>;
  guid: string;
  navigation: NavigationProp<any>;
}

function BoostConsoleScreen({
  route,
  guid,
  navigation,
}: BoostConsoleScreenProps) {
  const { t } = useTranslation();
  const { location: boostLocation, filter } = route?.params || {};
  const boostConsoleStore = useRef(new BoostConsoleStore()).current;
  let empty;

  /**
   * Load boosts data
   */
  const loadFeed = () => {
    boostConsoleStore.loadList(!!guid);
  };

  /**
   * Refresh feed data
   */
  const refresh = () => {
    boostConsoleStore.refresh();
  };

  useEffect(() => {
    if (boostLocation) {
      boostConsoleStore.setFilter(boostLocation);
    } else {
      if (filter) {
        boostConsoleStore.setFilter(filter);
      }
    }

    boostConsoleStore.loadList(!!guid);
  }, [boostConsoleStore, boostLocation, guid, filter]);

  /**
   * Render row
   */
  const renderBoost = row => {
    const boost = row.item;
    if (hasVariation('mob-4638-boost-v3')) {
      return <BoostV3 boost={boost} navigation={navigation} />;
    }

    return <Boost boost={boost} navigation={navigation} />;
  };

  if (boostConsoleStore.loading) {
    empty = <CenteredLoading />;
  }

  if (
    boostConsoleStore.list.loaded &&
    !boostConsoleStore.list.refreshing &&
    boostConsoleStore.feedFilter === 'all'
  ) {
    empty = (
      <View style={ComponentsStyle.emptyComponentContainer}>
        <View style={ComponentsStyle.emptyComponent}>
          <Icon name="boost" size={72} />
          <B1>{t("You don't have any boosts")}</B1>
          <Button
            onPress={() => navigation.navigate('Compose')}
            type="action"
            mode="outline"
            align="center"
            top="L"
            size="large">
            {t('Create a post')}
          </Button>
        </View>
      </View>
    );
  }

  const tabs = (
    <View>
      {hasVariation('mob-4638-boost-v3') ? <BoostTabBarV3 /> : <BoostTabBar />}
    </View>
  );

  return (
    <BoostConsoleStoreContext.Provider value={boostConsoleStore}>
      <Screen safe onlyTopEdge>
        <ScreenHeader
          title={t('Boost Console')}
          back
          extra={
            <IconButton
              name="cog"
              onPress={() =>
                navigation.navigate('More', {
                  screen: 'BoostSettingsScreen',
                  initial: false,
                })
              }
            />
          }
        />
        <FlatList
          ListHeaderComponent={tabs}
          ListEmptyComponent={empty}
          data={boostConsoleStore.list.entities.slice()}
          renderItem={renderBoost}
          keyExtractor={item => item.rowKey}
          onRefresh={refresh}
          refreshing={boostConsoleStore.list.refreshing}
          onEndReached={loadFeed}
          onEndReachedThreshold={0}
          style={styles.list}
        />
      </Screen>
    </BoostConsoleStoreContext.Provider>
  );
}

export default observer(BoostConsoleScreen);

const styles = ThemedStyles.create({
  list: ['bgPrimaryBackground', 'flexContainer', 'marginTop3x'],
});
