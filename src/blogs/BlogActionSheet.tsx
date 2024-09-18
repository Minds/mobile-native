import React, { Component } from 'react';

import { View, Alert } from 'react-native';

import Icon from '@expo/vector-icons/MaterialIcons';

import { APP_URI } from '../config/Config';

import type BlogModel from './BlogModel';
import {
  BottomSheetMenuItem,
  BottomSheetModal,
  BottomSheetButton,
  BottomSheetMenuItemProps,
} from '../common/components/bottom-sheet';
import { copyToClipboardOptions } from '~/common/helpers/copyToClipboard';
import sp from '~/services/serviceProvider';

type PropsType = {
  entity: BlogModel;
  navigation: any;
};

type StateType = {
  shown: boolean;
  options: Array<any>;
  userBlocked: boolean;
};

/**
 * Blog Actions Component
 */
export default class BlogActionSheet extends Component<PropsType, StateType> {
  ref = React.createRef<any>();
  state: StateType = {
    shown: false,
    options: [],
    userBlocked: false,
  };

  /**
   * Show menu
   */
  showActionSheet = () => {
    if (this.state.shown) {
      this.ref.current?.present();
    } else {
      this.setState({ options: this.getOptions(), shown: true });
    }
  };

  hideActionSheet = () => {
    this.ref.current?.dismiss();
  };

  /**
   * Get the options array based on the permissions
   */
  getOptions() {
    let options: Array<BottomSheetMenuItemProps> = [];
    const entity = this.props.entity;
    const i18n = sp.i18n;

    // if is not the owner
    if (!entity.isOwner()) {
      options.push({
        title: i18n.t('report'),
        iconName: 'flag-outline',
        iconType: 'ionicon',
        onPress: () => {
          this.hideActionSheet();
          this.props.navigation.navigate('Report', {
            entity: this.props.entity,
          });
        },
      });
    }
    // Copy URL
    options.push(
      copyToClipboardOptions(APP_URI + 'newsfeed/' + this.props.entity.guid),
    );

    options.push({
      title: i18n.t('share'),
      iconName: 'share-social',
      iconType: 'ionicon',
      onPress: () => {
        this.hideActionSheet();
        sp.resolve('share').share(
          this.cleanTitle(this.props.entity.title),
          APP_URI + 'newsfeed/' + this.props.entity.guid,
        );
      },
    });

    return options;
  }

  /**
   * Show an error message
   */
  showError() {
    const i18n = sp.i18n;
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
   * Render Header
   */
  render() {
    const theme = sp.styles.style;
    const i18n = sp.i18n;
    return (
      <View>
        <Icon
          name="more-vert"
          onPress={this.showActionSheet}
          size={28}
          style={theme.colorTertiaryText}
        />
        {this.state.shown && (
          <BottomSheetModal ref={this.ref} autoShow>
            {this.state.options.map((a, i) => (
              <BottomSheetMenuItem {...a} key={i} />
            ))}
            <BottomSheetButton
              text={i18n.t('cancel')}
              onPress={this.hideActionSheet}
            />
          </BottomSheetModal>
        )}
      </View>
    );
  }
}
