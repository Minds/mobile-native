import React, { Component } from 'react';

import { View, Alert, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';

import { MINDS_URI } from '../config/Config';
import shareService from '../share/ShareService';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';
import type BlogModel from './BlogModel';

type PropsType = {
  entity: BlogModel;
  navigation: any;
};

type StateType = {
  options: Array<any>;
  userBlocked: boolean;
};

/**
 * Blog Actions Component
 */
export default class BlogActionSheet extends Component<PropsType, StateType> {
  ActionSheet: ActionSheet | null;
  state: StateType = {
    options: [],
    userBlocked: false,
  };

  /**
   * Constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
  }

  /**
   * Show menu
   */
  async showActionSheet() {
    this.setState({ options: this.getOptions() }, () => {
      this.ActionSheet.show();
    });
  }

  /**
   * Handle selection by index
   * @param {number} index
   */
  handleSelection = (index: number) => {
    if (!this.state.options[index]) {
      return;
    }
    this.executeAction(this.state.options[index]);
  };

  /**
   * Get the options array based on the permissions
   */
  getOptions() {
    let options = [i18n.t('cancel')];
    const entity = this.props.entity;

    // if is not the owner
    if (!entity.isOwner()) {
      options.push(i18n.t('report'));
    }

    options.push(i18n.t('share'));

    return options;
  }

  /**
   * Show an error message
   */
  showError() {
    Alert.alert(
      i18n.t('sorry'),
      i18n.t('errorMessage') + '\n' + i18n.t('activity.tryAgain'),
      [{ text: i18n.t('ok'), onPress: () => {} }],
      { cancelable: false },
    );
  }

  /**
   * Trim and remove new line char
   * @param {string} title
   */
  cleanTitle(title) {
    if (!title) {
      return '';
    }
    return title.trim().replace(/\n/gm, ' ');
  }

  /**
   * Execute an action
   * @param {string} option
   */
  async executeAction(option) {
    switch (option) {
      case i18n.t('share'):
        shareService.share(
          this.cleanTitle(this.props.entity.title),
          MINDS_URI + 'newsfeed/' + this.props.entity.guid,
        );
        break;
      case i18n.t('report'):
        this.props.navigation.navigate('Report', { entity: this.props.entity });
        break;
    }
  }

  /**
   * Render Header
   */
  render() {
    const theme = ThemedStyles.style;

    const styles = {
      body: {
        flex: 1,
        alignSelf: 'flex-end',
        backgroundColor: ThemedStyles.getColor('primary_background'),
      },
      titleBox: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ThemedStyles.getColor('primary_background'),
      },
      buttonBox: {
        height: 50,
        marginTop: StyleSheet.hairlineWidth,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ThemedStyles.getColor('secondary_background'),
      },
      cancelButtonBox: {
        height: 50,
        marginTop: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ThemedStyles.getColor('secondary_background'),
      },
    };

    return (
      <View>
        <Icon
          name="more-vert"
          onPress={() => this.showActionSheet()}
          size={28}
          style={theme.colorTertiaryText}
        />
        <ActionSheet
          ref={(o) => (this.ActionSheet = o)}
          title={i18n.t('actions')}
          options={this.state.options}
          onPress={this.handleSelection}
          cancelButtonIndex={0}
          styles={styles}
        />
      </View>
    );
  }
}
