import { NavigationProp, RouteProp } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CenteredLoading from '~/common/components/CenteredLoading';
import MText from '~/common/components/MText';
import i18n from '~/common/services/i18n.service';
import { ComponentsStyle } from '~/styles/Components';
import ThemedStyles from '~/styles/ThemedStyles';
import { Button, Screen, ScreenHeader } from '~ui';
import { hasVariation } from '../../../../../ExperimentsProvider';
import BoostConsoleStore from '../boost-console.store';
import Boost from '../components/Boost';
import BoostTabBar from '../components/BoostTabBar';
import BoostTabBarV3 from '../components/v3/BoostTabBar';
import BoostV3 from '../components/v3/Boost';
import { BoostConsoleStoreContext } from '../contexts/boost-store.context';

interface BoostConsoleScreenProps {
  route: RouteProp<any>;
  guid: string;
  navigation: NavigationProp<any>;
}
/**
 * News feed list component
 */
@observer
export default class BoostConsoleScreen extends Component<BoostConsoleScreenProps> {
  boostConsoleStore = new BoostConsoleStore();

  state = {
    screen: 'gallery',
  };

  /**
   * On component will mount
   */
  componentDidMount() {
    const { filter } = this.props.route.params ?? {};
    if (filter) {
      this.boostConsoleStore.setFilter(filter);
    }

    this.boostConsoleStore.loadList(!!this.props.guid);
  }

  createPost() {
    this.props.navigation.navigate('Compose');
  }

  /**
   * Render component
   */
  render() {
    let empty;
    const theme = ThemedStyles.style;

    if (this.boostConsoleStore.loading) {
      empty = <CenteredLoading />;
    }

    if (
      this.boostConsoleStore.list.loaded &&
      !this.boostConsoleStore.list.refreshing
    ) {
      empty = (
        <View style={ComponentsStyle.emptyComponentContainer}>
          <View style={ComponentsStyle.emptyComponent}>
            <Icon name="trending-up" size={72} color="#444" />
            <MText style={ComponentsStyle.emptyComponentMessage}>
              {i18n.t('boosts.youDontHaveBoosts')}
            </MText>
            <Button
              onPress={() => this.props.navigation.navigate('Capture')}
              type="action"
              mode="outline"
              align="center"
              top="L"
              size="large">
              {i18n.t('createAPost')}
            </Button>
          </View>
        </View>
      );
    }

    const tabs = (
      <View>
        {hasVariation('mob-4638-boost-v3') ? (
          <BoostTabBarV3 />
        ) : (
          <BoostTabBar />
        )}
      </View>
    );

    return (
      <BoostConsoleStoreContext.Provider value={this.boostConsoleStore}>
        <Screen safe onlyTopEdge>
          <ScreenHeader title={i18n.t('settings.boostConsole')} back />
          <FlatList
            ListHeaderComponent={tabs}
            ListEmptyComponent={empty}
            data={this.boostConsoleStore.list.entities.slice()}
            renderItem={this.renderBoost}
            keyExtractor={item => item.rowKey}
            onRefresh={this.refresh}
            refreshing={this.boostConsoleStore.list.refreshing}
            onEndReached={this.loadFeed}
            onEndReachedThreshold={0}
            style={[
              theme.bgPrimaryBackground,
              theme.flexContainer,
              theme.marginTop3x,
            ]}
          />
        </Screen>
      </BoostConsoleStoreContext.Provider>
    );
  }

  /**
   * Load boosts data
   */
  loadFeed = () => {
    this.boostConsoleStore.loadList(!!this.props.guid);
  };

  /**
   * Refresh feed data
   */
  refresh = () => {
    this.boostConsoleStore.refresh();
  };

  /**
   * Render row
   */
  renderBoost = row => {
    const boost = row.item;
    if (hasVariation('mob-4638-boost-v3')) {
      return <BoostV3 boost={boost} navigation={this.props.navigation} />;
    }

    return <Boost boost={boost} navigation={this.props.navigation} />;
  };
}
