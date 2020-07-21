//@ts-nocheck
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';
import TopbarTabbar from '../common/components/topbar-tabbar/TopbarTabbar';

/**
 * Newsfeed top bar
 */
@inject('boost')
@observer
class BoostTabBar extends Component {
  render() {
    const theme = ThemedStyles.style;

    const tabs: Array<TabType<CurrencyType>> = [
      {
        id: 'peer',
        title: i18n.t('boosts.tabOffers'),
      },
      {
        id: 'newsfeed',
        title: i18n.t('boosts.tabNewsfeed'),
      },
      {
        id: 'content',
        title: i18n.t('boosts.tabSidebar'),
      },
    ];

    return (
      <TopbarTabbar
        titleStyle={theme.bold}
        tabs={tabs}
        onChange={this.props.boost.setFilter}
        current={this.props.boost.filter}
      />
    );
  }
}

export default BoostTabBar;
