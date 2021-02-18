import React, { Component } from 'react';

import { View, Alert, Text, StyleSheet, Linking } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';

import { MINDS_URI } from '../../config/Config';
import { isFollowing } from '../NewsfeedService';
import shareService from '../../share/ShareService';
import i18n from '../../common/services/i18n.service';
import featuresService from '../../common/services/features.service';
import translationService from '../../common/services/translation.service';
import { FLAG_EDIT_POST, FLAG_DELETE_POST } from '../../common/Permissions';
import sessionService from '../../common/services/session.service';
import NavigationService from '../../navigation/NavigationService';
import ThemedStyles from '../../styles/ThemedStyles';
import type ActivityModel from '../ActivityModel';
import { showNotification } from '../../../AppMessages';

type PropsType = {
  entity: ActivityModel;
  onTranslate?: Function;
  testID?: string;
  navigation: any;
};

type StateType = {
  options: Array<any>;
  userBlocked: boolean;
};

/**
 * Activity Actions Component
 */
export default class ActivityActionSheet extends Component<
  PropsType,
  StateType
> {
  ActionSheet: ActionSheet | null;
  deleteOption: React.ReactNode;
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
    const theme = ThemedStyles.style;
    this.deleteOption = (
      <Text testID="deleteOption" style={[theme.colorDanger, theme.fontXL]}>
        {i18n.t('delete')}
      </Text>
    );
  }

  /**
   * Show menu
   */
  async showActionSheet() {
    if (this.props.entity['is:following'] === undefined) {
      this.props.entity['is:following'] = await isFollowing(
        this.props.entity.guid,
      );
    }

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

    const reminded =
      entity.remind_users &&
      entity.remind_users.some(
        (user) => user.guid === sessionService.getUser().guid,
      );

    if (reminded) {
      options.push(i18n.t('undoRemind'));
    }

    // TODO: remove feature flag
    if (featuresService.has('permissions')) {
      // if can edit
      if (entity.can(FLAG_EDIT_POST)) {
        options.push(i18n.t('edit'));

        if (!entity.mature) {
          options.push(i18n.t('setExplicit'));
        } else {
          options.push(i18n.t('removeExplicit'));
        }

        if (!entity.dontPin) {
          if (!entity.pinned) {
            options.push(i18n.t('pin'));
          } else {
            options.push(i18n.t('unpin'));
          }
        }
        if (featuresService.has('allow-comments-toggle')) {
          options.push(
            entity.allow_comments
              ? i18n.t('disableComments')
              : i18n.t('enableComments'),
          );
        }
      }

      if (
        !!this.props.onTranslate &&
        translationService.isTranslatable(entity)
      ) {
        options.push(i18n.t('translate.translate'));
      }

      // if is not the owner
      if (!entity.isOwner()) {
        options.push(i18n.t('report'));

        if (this.state && this.state.userBlocked) {
          options.push(i18n.t('channel.unblock'));
        } else {
          options.push(i18n.t('channel.block'));
        }
      }

      options.push(i18n.t('share'));

      if (!entity['is:following']) {
        options.push(i18n.t('follow'));
      } else {
        options.push(i18n.t('unfollow'));
      }

      // if can delete
      if (entity.can(FLAG_DELETE_POST)) {
        options.push(this.deleteOption);
      }
    } else {
      // if can edit
      if (entity.isOwner()) {
        options.push(i18n.t('edit'));

        if (!entity.mature) {
          options.push(i18n.t('setExplicit'));
        } else {
          options.push(i18n.t('removeExplicit'));
        }

        if (!entity.dontPin) {
          if (!entity.pinned) {
            options.push(i18n.t('pin'));
          } else {
            options.push(i18n.t('unpin'));
          }
        }
        if (featuresService.has('allow-comments-toggle')) {
          options.push(
            entity.allow_comments
              ? i18n.t('disableComments')
              : i18n.t('enableComments'),
          );
        }
      }

      if (translationService.isTranslatable(entity)) {
        options.push(i18n.t('translate.translate'));
      }

      if (featuresService.has('permaweb') && entity.permaweb_id) {
        options.push(i18n.t('permaweb.viewOnPermaweb'));
      }

      // if is not the owner
      if (!entity.isOwner()) {
        options.push(i18n.t('report'));

        if (this.state && this.state.userBlocked) {
          options.push(i18n.t('channel.unblock'));
        } else {
          options.push(i18n.t('channel.block'));
        }
      }

      options.push(i18n.t('share'));

      if (!entity['is:following']) {
        options.push(i18n.t('follow'));
      } else {
        options.push(i18n.t('unfollow'));
      }

      // if can delete
      const containerObj = entity.containerObj;
      if (
        entity.isOwner() ||
        sessionService.getUser().isAdmin() ||
        (containerObj && containerObj['is:owner'])
      ) {
        options.push(this.deleteOption);
      }
    }

    if (entity.hasImage()) {
      options.push(i18n.t('imageViewer'));
    }

    return options;
  }

  /**
   * Delete an entity
   */
  async deleteEntity() {
    try {
      await this.props.entity.deleteEntity();

      const state = NavigationService.getCurrentState();

      if (state && state.name === 'Activity') {
        this.props.navigation.goBack();
      }
    } catch (err) {
      this.showError();
    }
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
   * Execute an action
   * @param {string} option
   */
  async executeAction(option) {
    switch (option) {
      case i18n.t('undoRemind'):
        try {
          await this.props.entity.deleteRemind();
          showNotification(i18n.t('remindRemoved'), 'success');
        } catch (error) {
          showNotification(i18n.t('errorMessage'), 'warning');
        }
        break;
      case this.deleteOption:
        setTimeout(() => {
          Alert.alert(
            i18n.t('delete'),
            i18n.t('confirmNoUndo'),
            [
              { text: i18n.t('cancel'), style: 'cancel' },
              { text: i18n.t('ok'), onPress: () => this.deleteEntity() },
            ],
            { cancelable: false },
          );
          return;
        }, 300);
        break;
      case i18n.t('translate.translate'):
        if (this.props.onTranslate) this.props.onTranslate();
        break;
      case i18n.t('edit'):
        this.props.navigation.navigate('Capture', {
          isEdit: true,
          entity: this.props.entity,
        });
        break;
      case i18n.t('setExplicit'):
      case i18n.t('removeExplicit'):
        try {
          await this.props.entity.toggleExplicit();
          // this.reloadOptions();
        } catch (err) {
          this.showError();
        }
        break;
      case i18n.t('channel.block'):
        try {
          await this.props.entity.blockOwner();
          this.setState({
            userBlocked: true,
          });
        } catch (err) {
          this.showError();
        }
        break;
      case i18n.t('channel.unblock'):
        try {
          await this.props.entity.unblockOwner();
          this.setState({
            userBlocked: false,
          });
        } catch (err) {
          this.showError();
        }
        break;
      case i18n.t('follow'):
      case i18n.t('unfollow'):
        try {
          await this.props.entity.toggleFollow();
          // this.reloadOptions();
        } catch (err) {
          this.showError();
        }
        break;
      case i18n.t('share'):
        shareService.share(
          this.props.entity.text,
          MINDS_URI + 'newsfeed/' + this.props.entity.guid,
        );
        break;
      case i18n.t('pin'):
      case i18n.t('unpin'):
        this.props.entity.togglePin();
        break;
      case i18n.t('report'):
        this.props.navigation.navigate('Report', { entity: this.props.entity });
        break;
      case i18n.t('enableComments'):
      case i18n.t('disableComments'):
        try {
          await this.props.entity.toggleAllowComments();
        } catch (err) {
          this.showError();
        }
        break;
      case i18n.t('permaweb.viewOnPermaweb'):
        Linking.openURL(
          'https://viewblock.io/arweave/tx/' + this.props.entity.permaweb_id,
        );
        break;
      case i18n.t('imageViewer'):
        const source = this.props.entity.getThumbSource('xlarge');
        this.props.navigation.navigate('ViewImage', {
          entity: this.props.entity,
          source,
        });
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
          testID={this.props.testID}
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
