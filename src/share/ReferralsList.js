import React, {
  Component
} from 'react';

import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import { CommonStyle } from '../styles/Common';

import i18n from '../common/services/i18n.service';
import CenteredLoading from '../common/components/CenteredLoading';
import ReferralsRow from './ReferralsRow';

@inject('referrals')
@observer
export default class ReferralsList extends Component {

  /**
   * On component will unmount
   */
  componentWillUnmount() {
    //TODO clear list
  }

   /**
   * On component will mount
   */
  componentDidMount() {
    //TODO prepare data and load list
    this.setState(() => {
      this.loadMore();
    });
  }

  /**
   * Render
   */
  render() {
    const referrals = this.props.referrals;
    const entities = referrals.list.entities;
    const header = this.getHeader();
    let view = !referrals.list.loaded ? (<CenteredLoading />) : (<View />);
    return (
      <FlatList
        data={entities.slice()}
        renderItem={this.renderRow}
        keyExtractor={(item, index) => item.timestamp || 0 + index}
        onRefresh={this.refresh}
        refreshing={referrals.list.refreshing}
        onEndReached={this.loadMore}
        // onEndReachedThreshold={0}
        ListHeaderComponent={header}
        ListEmptyComponent={view}
        style={[CommonStyle.flexContainer, CommonStyle.backgroundWhite]}
      />
    )
  }

  /**
   * Get header
   */
  getHeader() {
    return (
      <View style={styles.header}>
        <View style={[CommonStyle.rowJustifyStart, styles.row]}>
          <Text style={[{fontWeight: '800', fontSize: 10, flex:5 }]}>{i18n.t('auth.username')}</Text>
          <Text style={[{fontWeight: '800', fontSize: 10, flex:2 }]}>{i18n.t('referrals.referralsStatus')}</Text>
          <Text style={[{fontWeight: '800', fontSize: 10, flex:3 }]}>{i18n.t('referrals.referralsWalletSingup')}</Text>
        </View>
      </View>
    );
  }

  /**
   * Load more data
   */
  loadMore = () => {
    this.props.referrals.loadList();
  }

  /**
   * Render list's rows
   */
  renderRow = (row, i) => {
    const item = row.item;
    return (
      <ReferralsRow item={item} key={i} navigation={this.props.navigation} />
    )
  }

  /**
   * Refresh list
   */
  refresh = () => {
    this.props.referrals.refresh();
  }
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 5,
  },
  row: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 8,
    paddingRight: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
  },
  column: {
    color: '#555',
  },
});
