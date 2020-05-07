//@ts-nocheck
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';

import GrousBarItem from './GroupsBarItem';
import i18n from '../common/services/i18n.service';
import GroupModel from './GroupModel';
import ThemedStyles from '../styles/ThemedStyles';

@inject('groupsBar')
@observer
export default class GroupsBar extends Component {
  state = {
    errorLoading: false,
  };
  observer;

  /**
   * Component did mount
   */
  componentDidMount() {
    const joins = fromEvent(GroupModel.events, 'joinedGroup');
    const leaves = fromEvent(GroupModel.events, 'leavedGroup');

    this.observer = merge(joins, leaves)
      .pipe(debounceTime(1500))
      .subscribe(this.onGroupsChanged);
  }

  componentWillUnmount() {
    if (this.observer && this.observer.unsubscribe) {
      this.observer.unsubscribe();
    }
  }

  /**
   * On groups changed
   */
  onGroupsChanged = () => {
    this.props.groupsBar.setGroups([], true);
    this.props.groupsBar.loadGroups();
  };

  async initialLoad() {
    await this.props.groupsBar.readLocal();
    await this.load();
  }

  load = async () => {
    if (this.state.errorLoading) this.setState({ errorLoading: false });
    try {
      await this.props.groupsBar.loadGroups();
      await this.props.groupsBar.loadMarkers();
    } catch (error) {
      this.setState({ errorLoading: true });
    }
  };

  /**
   * Render group items
   * @param {object} row
   * @param {number} i
   */
  renderItem = (row, i) => {
    return <GrousBarItem group={row.item} key={i} />;
  };

  loadMore = () => {
    this.props.groupsBar.loadGroups();
  };

  renderError() {
    const theme = ThemedStyles.style;
    return (
      <TouchableOpacity onPress={this.load} style={[theme.flexContainer]}>
        <View
          style={[theme.columnAlignCenter, theme.centered, theme.padding2x]}>
          <Text
            style={[
              theme.fontXS,
              theme.colorSecondaryText,
              theme.marginBottom,
            ]}>
            {i18n.t('groups.errorLoading')}
          </Text>
          <Text
            style={[
              theme.fontS,
              theme.colorLink,
              theme.borderPrimary,
              theme.border,
              theme.borderRadius7x,
              theme.padding,
            ]}>
            {i18n.t('tryAgain')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  /**
   * Render
   */
  render() {
    const theme = ThemedStyles.style;
    return (
      <FlatList
        ListFooterComponent={
          this.state.errorLoading ? (
            this.renderError()
          ) : this.props.groupsBar.loading ? (
            <ActivityIndicator
              size="large"
              style={[theme.padding, styles.loading]}
            />
          ) : undefined
        }
        contentContainerStyle={[
          theme.rowJustifyStart,
          theme.backgroundSecondary,
        ]}
        style={[styles.bar]}
        horizontal={true}
        renderItem={this.renderItem}
        data={this.props.groupsBar.groups.slice()}
        onEndReached={this.loadMore}
      />
    );
  }
}

const styles = StyleSheet.create({
  bar: {
    minHeight: 80,
  },
  loading: {
    height: 80,
    alignSelf: 'center',
  },
});
