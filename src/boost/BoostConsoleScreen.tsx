//@ts-nocheck
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { Button, H2, Icon } from '~ui';
import CenteredLoading from '../common/components/CenteredLoading';
import i18n from '../common/services/i18n.service';
import { ComponentsStyle } from '../styles/Components';
import ThemedStyles from '../styles/ThemedStyles';
import Boost from './Boost';
import BoostTabBar from './BoostTabBar';

/**
 * News feed list component
 */
@inject('boost')
@observer
export default class BoostConsoleScreen extends Component {
  state = {
    screen: 'gallery',
  };

  /**
   * On component will mount
   */
  componentDidMount() {
    const filter = this.props.route.params
      ? this.props.route.params.filter
      : null;

    if (filter) {
      this.props.boost.setFilter(filter);
    }

    this.props.boost.loadList(this.props.guid);
  }

  createPost = () => {
    this.props.navigation.navigate('Compose');
  };
  /**
   * Render component
   */
  render() {
    let empty;
    const theme = ThemedStyles.style;

    if (this.props.boost.loading) {
      empty = <CenteredLoading />;
    }

    if (this.props.boost.list.loaded && !this.props.boost.list.refreshing) {
      empty = (
        <View style={ComponentsStyle.emptyComponentContainer}>
          <View style={ComponentsStyle.emptyComponent}>
            <Icon name="boost" size="huge" />
            <H2 color="secondary" vertical="M">
              {i18n.t('boosts.youDontHaveBoosts')}
            </H2>
            <Button
              onPress={this.createPost}
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
        <BoostTabBar />
      </View>
    );
    return (
      <FlatList
        ListHeaderComponent={tabs}
        ListEmptyComponent={empty}
        data={this.props.boost.list.entities.slice()}
        renderItem={this.renderBoost}
        keyExtractor={item => item.rowKey}
        onRefresh={this.refresh}
        refreshing={this.props.boost.list.refreshing}
        onEndReached={this.loadFeed}
        onEndReachedThreshold={0}
        style={[
          theme.bgPrimaryBackground,
          theme.flexContainer,
          theme.marginTop3x,
        ]}
      />
    );
  }

  /**
   * Load boosts data
   */
  loadFeed = () => {
    this.props.boost.loadList(this.props.guid);
  };

  /**
   * Refresh feed data
   */
  refresh = () => {
    this.props.boost.refresh(this.props.guid);
  };

  /**
   * Render row
   */
  renderBoost = row => {
    const boost = row.item;
    return <Boost boost={boost} navigation={this.props.navigation} />;
  };
}
