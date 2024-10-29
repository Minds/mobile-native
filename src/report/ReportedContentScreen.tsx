import React, { Component } from 'react';

import { StyleSheet, FlatList, View, TouchableHighlight } from 'react-native';

import { observer, inject } from 'mobx-react';

import ErrorLoading from '../common/components/ErrorLoading';
import CenteredLoading from '../common/components/CenteredLoading';

import ReportedContentRow from './ReportedContentRow';
import MText from '../common/components/MText';
import type ReportStore from './ReportStore';
import EmptyList from '~/common/components/EmptyList';
import sp from '~/services/serviceProvider';

/**
 * Discovery screen
 */
@inject('reportstore')
@observer
class ReportedContentScreen extends Component<{ reportstore: ReportStore }> {
  /**
   * On component will mount
   */
  componentDidMount() {
    this.props.reportstore.loadList();
  }

  renderRow = row => {
    return <ReportedContentRow appeal={row.item} />;
  };

  /**
   * On tab change
   */
  onTabChange = value => {
    this.props.reportstore.setFilter(value);
    this.props.reportstore.reload();
  };

  /**
   * Render
   */
  render() {
    const CS = sp.styles.style;

    let body;

    const store = this.props.reportstore;

    const footerCmp = store.list.errorLoading ? (
      <ErrorLoading message={sp.i18n.t('cantLoad')} tryAgain={store.loadList} />
    ) : null;

    if (
      !store.list.loaded &&
      !store.list.refreshing &&
      !store.list.errorLoading
    ) {
      body = <CenteredLoading />;
    } else {
      body = (
        <FlatList<{ guid: string }>
          data={store.list.appeals.slice()}
          renderItem={this.renderRow}
          keyExtractor={item => item.guid}
          onRefresh={this.refresh}
          refreshing={store.list.refreshing}
          onEndReached={this.loadFeed}
          initialNumToRender={12}
          style={styles.listView}
          ListFooterComponent={footerCmp}
          ListEmptyComponent={
            !store.list.loaded && !store.list.refreshing ? null : <EmptyList />
          }
        />
      );
    }

    const selectedButton = {
      alignItems: 'center',
      borderBottomWidth: 3,
      ...CS.bcolorPrimaryBorder,
    };

    const headerStyle = [CS.colorSecondaryText, CS.fontM, CS.textCenter];
    const i18n = sp.i18n;

    return (
      <View style={[CS.flexContainer, CS.bgSecondaryBackground]}>
        <View style={styles.topbar}>
          <View style={[CS.flexContainer, CS.rowJustifyCenter]}>
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => store.setFilter('review')}
              style={
                store.filter == 'review'
                  ? [selectedButton, CS.flexContainerCenter]
                  : [styles.buttons, CS.flexContainerCenter]
              }>
              <MText style={headerStyle}>
                {i18n.t('settings.reportedContent.reviewPending')}
              </MText>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => store.setFilter('pending')}
              style={
                store.filter == 'pending'
                  ? [selectedButton, CS.flexContainerCenter]
                  : [styles.buttons, CS.flexContainerCenter]
              }>
              <MText style={headerStyle}>
                {i18n.t('settings.reportedContent.reviewAppealed')}
              </MText>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => store.setFilter('approved')}
              style={
                store.filter == 'approved'
                  ? [selectedButton, CS.flexContainerCenter]
                  : [styles.buttons, CS.flexContainerCenter]
              }>
              <MText style={headerStyle}>
                {i18n.t('settings.reportedContent.reviewApproved')}
              </MText>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => store.setFilter('rejected')}
              style={
                store.filter == 'rejected'
                  ? [selectedButton, CS.flexContainerCenter]
                  : [styles.buttons, CS.flexContainerCenter]
              }>
              <MText style={headerStyle}>
                {i18n.t('settings.reportedContent.reviewRejected')}
              </MText>
            </TouchableHighlight>
          </View>
        </View>
        {body}
      </View>
    );
  }

  /**
   * Load subs data
   */
  loadFeed = () => {
    this.props.reportstore.loadList();
  };

  /**
   * Refresh subs data
   */
  refresh = () => {
    this.props.reportstore.refresh();
  };
}

export default ReportedContentScreen;

const styles = StyleSheet.create({
  listView: {
    flex: 1,
  },
  topbar: {
    height: 35,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttons: {
    alignItems: 'center',
  },
});
