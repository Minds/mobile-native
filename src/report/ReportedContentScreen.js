//@ts-nocheck
import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableHighlight,
} from 'react-native';

import { observer, inject } from 'mobx-react';

import ErrorLoading from '../common/components/ErrorLoading';
import CenteredLoading from '../common/components/CenteredLoading';
import ThemedStyles from '../styles/ThemedStyles';
import i18n from '../common/services/i18n.service';
import ReportedContentRow from './ReportedContentRow';
import { ComponentsStyle } from '../styles/Components';

/**
 * Discovery screen
 */
@inject('reportstore')
@observer
class ReportedContentScreen extends Component {
  /**
   * On component will mount
   */
  componentDidMount() {
    this.props.reportstore.loadList();
  }

  renderRow = (row) => {
    return <ReportedContentRow appeal={row.item} />;
  };

  /**
   * On tab change
   */
  onTabChange = (value) => {
    this.props.reportstore.setFilter(value);
    this.props.reportstore.reload();
  };

  /**
   * Load data
   */
  loadMore = () => {
    if (this.props.reportstore.list.errorLoading) return;
    this.props.blogs.loadList();
  };

  /**
   * Render
   */
  render() {
    const CS = ThemedStyles.style;

    let body;

    const store = this.props.reportstore;

    const footerCmp = store.list.errorLoading ? (
      <ErrorLoading message={i18n.t('cantLoad')} tryAgain={store.loadList} />
    ) : null;

    if (
      !store.list.loaded &&
      !store.list.refreshing &&
      !store.list.errorLoading
    ) {
      body = <CenteredLoading />;
    } else {
      const empty = (
        <View style={ComponentsStyle.emptyComponentContainer}>
          <View style={ComponentsStyle.emptyComponent}>
            <Text
              style={[
                ComponentsStyle.emptyComponentMessage,
                CS.colorSecondaryText,
              ]}>
              {i18n.t('blogs.blogListEmpty')}
            </Text>
          </View>
        </View>
      );

      body = (
        <FlatList
          data={store.list.appeals.slice()}
          renderItem={this.renderRow}
          keyExtractor={(item) => item.guid}
          onRefresh={this.refresh}
          refreshing={store.list.refreshing}
          onEndReached={this.loadFeed}
          initialNumToRender={12}
          style={styles.listView}
          ListFooterComponent={footerCmp}
          ListEmptyComponent={
            !store.list.loaded && !stores.list.refreshing ? null : empty
          }
        />
      );
    }

    const selectedButton = {
      alignItems: 'center',
      borderBottomWidth: 3,
      ...CS.borderPrimary,
    };

    const headerStyle = [CS.colorSecondaryText, CS.fontM, CS.textCenter];

    return (
      <View style={[CS.flexContainer, CS.backgroundSecondary]}>
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
              <Text style={headerStyle}>
                {i18n.t('settings.reportedContent.reviewPending')}
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => store.setFilter('pending')}
              style={
                store.filter == 'pending'
                  ? [selectedButton, CS.flexContainerCenter]
                  : [styles.buttons, CS.flexContainerCenter]
              }>
              <Text style={headerStyle}>
                {i18n.t('settings.reportedContent.reviewAppealed')}
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => store.setFilter('approved')}
              style={
                store.filter == 'approved'
                  ? [selectedButton, CS.flexContainerCenter]
                  : [styles.buttons, CS.flexContainerCenter]
              }>
              <Text style={headerStyle}>
                {i18n.t('settings.reportedContent.reviewApproved')}
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => store.setFilter('rejected')}
              style={
                store.filter == 'rejected'
                  ? [selectedButton, CS.flexContainerCenter]
                  : [styles.buttons, CS.flexContainerCenter]
              }>
              <Text style={headerStyle}>
                {i18n.t('settings.reportedContent.reviewRejected')}
              </Text>
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
