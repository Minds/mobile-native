import React, {
  Component
} from 'react';

import {
  View,
  Alert,
  Text,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'

import { MINDS_URI } from '../../config/Config';
import testID from '../../common/helpers/testID';
import { isFollowing } from '../NewsfeedService';
import { CommonStyle as CS } from '../../styles/Common';
import shareService from '../../share/ShareService';
import i18n from '../../common/services/i18n.service';
import featuresService from '../../common/services/features.service';
import translationService from '../../common/services/translation.service';
import { FLAG_EDIT_POST, FLAG_DELETE_POST } from '../../common/Permissions';
import sessionService from '../../common/services/session.service';
import NavigationService from '../../navigation/NavigationService';

/**
 * Activity Actions Component
 */
export default class ActivityActionSheet extends Component {

  state = {
    options: [],
    userBlocked: false
  }

  /**
   * Constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.deleteOption = <Text testID='deleteOption' style={[CS.colorDanger, CS.fontXL]}>{i18n.t('delete')}</Text>
  }

  /**
   * Show menu
   */
  async showActionSheet() {
    if (this.props.entity['is:following'] === undefined) {
      this.props.entity['is:following'] = await isFollowing(this.props.entity.guid);
    }

    this.setState({options: this.getOptions()}, () => {
      this.ActionSheet.show();
    });
  }

  /**
   * Handle selection by index
   * @param {number} index
   */
  handleSelection = (index) => {
    if (!this.state.options[index]) return;
    this.executeAction(this.state.options[index], index);
  }

  /**
   * Get the options array based on the permissions
   */
  getOptions() {
    let options = [ i18n.t('cancel') ];
    const entity = this.props.entity;

    // TODO: remove feature flag
    if (featuresService.has('permissions')) {
      // if can edit
      if (entity.can(FLAG_EDIT_POST)) {
        options.push( i18n.t('edit') );

        if (!entity.mature) {
          options.push( i18n.t('setExplicit') );
        } else {
          options.push( i18n.t('removeExplicit') );
        }

        if (!entity.dontPin) {
          if (!entity.pinned) {
            options.push( i18n.t('pin') );
          } else {
            options.push( i18n.t('unpin') );
          }
        }
        if (featuresService.has('allow-comments-toggle')) {
          options.push( entity.allow_comments ? i18n.t('disableComments') : i18n.t('enableComments'));
        }
      }

      if (translationService.isTranslatable(entity)) {
        options.push( i18n.t('translate.translate') );
      }

      // if is not the owner
      if (!entity.isOwner()) {
        options.push( i18n.t('report') );

        if (this.state && this.state.userBlocked) {
          options.push( i18n.t('channel.unblock') );
        } else {
          options.push( i18n.t('channel.block') );
        }
      }

      options.push( i18n.t('share') );

      if (!entity['is:following']) {
        options.push( i18n.t('follow') );
      } else {
        options.push( i18n.t('unfollow') );
      }

      // if can delete
      if (entity.can(FLAG_DELETE_POST)) {
        options.push(this.deleteOption);
      }
    } else {
      // if can edit
      if (entity.isOwner()) {
        options.push( i18n.t('edit') );

        if (!entity.mature) {
          options.push( i18n.t('setExplicit') );
        } else {
          options.push( i18n.t('removeExplicit') );
        }

        if (!entity.dontPin) {
          if (!entity.pinned) {
            options.push( i18n.t('pin') );
          } else {
            options.push( i18n.t('unpin') );
          }
        }
        if (featuresService.has('allow-comments-toggle')) {
          options.push( entity.allow_comments ? i18n.t('disableComments') : i18n.t('enableComments'));
        }
      }

      if (translationService.isTranslatable(entity)) {
        options.push( i18n.t('translate.translate') );
      }

      // if is not the owner
      if (!entity.isOwner()) {
        options.push( i18n.t('report') );

        if (this.state && this.state.userBlocked) {
          options.push( i18n.t('channel.unblock') );
        } else {
          options.push( i18n.t('channel.block') );
        }
      }

      options.push( i18n.t('share') );

      if (!entity['is:following']) {
        options.push( i18n.t('follow') );
      } else {
        options.push( i18n.t('unfollow') );
      }

      // if can delete
      if (entity.isOwner() || sessionService.getUser().isAdmin()) {
        options.push(this.deleteOption);
      }
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
  showError(err) {
    console.log(err)
    Alert.alert(
      i18n.t('sorry'),
      i18n.t('errorMessage') + '\n' + i18n.t('activity.tryAgain'),
      [
        {text: i18n.t('ok'), onPress: () => {}},
      ],
      { cancelable: false }
    );
  }

  /**
   * Execute an action
   * @param {string} option
   */
  async executeAction(option) {
    switch (option) {
      case this.deleteOption:
        setTimeout(() => {
          Alert.alert(
            i18n.t('delete'),
            i18n.t('confirmNoUndo'),
            [
              {text: i18n.t('cancel'), style: 'cancel'},
              {text: i18n.t('ok'), onPress: () => this.deleteEntity()},
            ],
            { cancelable: false }
          );
          return;
        }, 300);
        break;
      case i18n.t('translate.translate'):
        if (this.props.onTranslate) this.props.onTranslate();
        break;
      case i18n.t('edit'):
        this.props.toggleEdit(true);
        break;
      case i18n.t('setExplicit'):
      case i18n.t('removeExplicit'):
        try {
          await this.props.entity.toggleExplicit();
          // this.reloadOptions();
        } catch (err) {
          this.showError(err);
        }
        break;
      case i18n.t('channel.block'):
        try {
          await this.props.entity.blockOwner();
          this.setState({
            userBlocked: true,
          });
        } catch (err) {
          this.showError(err);
        }
        break;
      case i18n.t('channel.unblock'):
        try {
          await this.props.entity.unblockOwner();
          this.setState({
            userBlocked: false,
          });
        } catch (err) {
          this.showError(err);
        }
        break;
      case i18n.t('follow'):
      case i18n.t('unfollow'):
        try {
          await this.props.entity.toggleFollow();
          // this.reloadOptions();
        } catch (err) {
          this.showError(err);
        }
        break;
      case i18n.t('share'):
        shareService.share(this.props.entity.text, MINDS_URI + 'newsfeed/' + this.props.entity.guid);
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
          this.showError(err);
        }
        break;
    }
  }

  /**
   * Render Header
   */
  render() {
    return (
      <View style={[CS.flexContainer, CS.centered]}>
        <Icon
          name="more-vert"
          onPress={() => this.showActionSheet()}
          size={26}
          style={CS.colorDarkGreyed}
          testID={this.props.testID}
        />
        <ActionSheet
          ref={o => this.ActionSheet = o}
          title={i18n.t('actions')}
          options={this.state.options}
          onPress={this.handleSelection}
          cancelButtonIndex={0}
        />
      </View>
    )
  }
}