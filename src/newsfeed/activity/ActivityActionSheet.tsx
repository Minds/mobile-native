import React, { PureComponent } from 'react';
import { Alert, Linking } from 'react-native';
import { BottomSheetModal as BottomSheetModalType } from '@gorhom/bottom-sheet';
import {
  WithSafeAreaInsetsProps,
  withSafeAreaInsets,
} from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';

import { IconButtonNext } from '~ui/icons';
import { ANDROID_CHAT_APP, IS_IOS, MINDS_URI } from '../../config/Config';
import { isFollowing } from '../NewsfeedService';
import shareService from '../../share/ShareService';
import i18n from '../../common/services/i18n.service';
import translationService from '../../common/services/translation.service';
import sessionService from '../../common/services/session.service';
import NavigationService from '../../navigation/NavigationService';
import type ActivityModel from '../ActivityModel';
import { showNotification } from '../../../AppMessages';
import {
  BottomSheetButton,
  BottomSheetMenuItem,
  pushBottomSheet,
} from '../../common/components/bottom-sheet';
import { withChannelContext } from '~/channel/v2/ChannelContext';
import type UserModel from '~/channel/UserModel';
import SendIntentAndroid from 'react-native-send-intent';
import logService from '~/common/services/log.service';
import { isApiError } from '../../common/services/api.service';
import { GroupContext } from '~/modules/groups/contexts/GroupContext';
import { copyToClipboardOptions } from '~/common/helpers/copyToClipboard';

type PropsType = {
  entity: ActivityModel;
  onTranslate?: Function;
  testID?: string;
  navigation: any;
  channel?: UserModel;
  isChatHidden?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
} & WithSafeAreaInsetsProps;

type StateType = {
  options: Array<any>;
  userBlocked: boolean;
};

/**
 * Activity Actions Component
 */
class ActivityActionSheet extends PureComponent<PropsType, StateType> {
  static contextType = GroupContext;
  declare context: React.ContextType<typeof GroupContext>;
  ref = React.createRef<BottomSheetModalType>();
  shareMenuRef = React.createRef<BottomSheetModalType>();
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
  }

  /**
   * Show menu
   */
  showActionSheet = async () => {
    if (this.props.entity['is:following'] === undefined) {
      this.props.entity['is:following'] = await isFollowing(
        this.props.entity.guid,
      );
    }

    this.setState({ options: this.getOptions() }, () => {
      pushActionSheet({ options: this.state.options });
    });
  };

  /**
   * Get the options array based on the permissions
   */
  getOptions() {
    const options: Array<{
      iconName: string;
      iconType: string;
      title: string;
      testID?: string;
      onPress: () => Promise<void> | void;
    }> = [];

    const entity = this.props.entity;
    const isReminded = entity.remind_users && entity.remind_users.length;

    const remindedByMe =
      entity.remind_users &&
      entity.remind_users.some(
        user => user.guid === sessionService.getUser().guid,
      );

    if (remindedByMe || (isReminded && sessionService.getUser().isAdmin())) {
      options.push({
        title: i18n.t('undoRemind'),
        iconName: 'undo',
        iconType: 'material',
        onPress: async () => {
          try {
            await this.props.entity.deleteRemind();
            showNotification(i18n.t('remindRemoved'), 'success');
          } catch (error) {
            showNotification(i18n.t('errorMessage'), 'warning');
          }
        },
      });
    }

    // if can edit
    if (entity.isOwner()) {
      // Edit
      options.push({
        title: i18n.t('edit'),
        iconName: 'edit',
        iconType: 'material',
        onPress: () => {
          this.props.navigation.navigate('Compose', {
            isEdit: true,
            entity: this.props.entity,
          });
        },
      });

      // Set / Remove explicit
      options.push({
        title: !entity.mature
          ? i18n.t('setExplicit')
          : i18n.t('removeExplicit'),
        iconName: 'explicit',
        iconType: 'material',
        onPress: async () => {
          try {
            await this.props.entity.toggleExplicit();
          } catch (err) {
            this.showError();
          }
        },
      });

      if (!entity.dontPin && this.props.channel) {
        // Pin / Unpin
        options.push({
          title: !entity.pinned ? i18n.t('pin') : i18n.t('unpin'),
          iconName: 'pin-outline',
          iconType: 'material-community',
          onPress: () => {
            this.props.entity.togglePin();
          },
        });
      }

      options.push({
        title: entity.allow_comments
          ? i18n.t('disableComments')
          : i18n.t('enableComments'),
        iconName: entity.allow_comments ? 'speaker-notes-off' : 'speaker-notes',
        iconType: 'material',
        onPress: async () => {
          try {
            await this.props.entity.toggleAllowComments();
          } catch (err: any) {
            this.showError(err?.message);
          }
        },
      });
    } else {
      if (entity?.boosted) {
        options.push({
          title: i18n.t('hidePost'),
          iconName: 'eye-off',
          iconType: 'material-community',
          onPress: async () => {
            try {
              await this.props.entity.hideEntity();
              showNotification(i18n.t('postHidden'), 'success');
            } catch (error) {
              showNotification(i18n.t('errorMessage'), 'warning');
            }
          },
        });
      }
      options.push({
        title: 'Boost',
        iconName: 'trending-up',
        iconType: 'material-community',
        onPress: () => {
          this.props.navigation.push('BoostScreenV2', {
            entity: this.props.entity,
          });
        },
      });
    }

    if (!!this.props.onTranslate && translationService.isTranslatable(entity)) {
      // Translate
      options.push({
        title: i18n.t('translate.translate'),
        iconName: 'translate',
        iconType: 'material',
        onPress: () => {
          if (this.props.onTranslate) {
            this.props.onTranslate();
          }
        },
      });
    }

    // Permaweb
    if (entity.permaweb_id) {
      options.push({
        title: i18n.t('permaweb.viewOnPermaweb'),
        iconName: 'format-paragraph',
        iconType: 'material-community',
        onPress: () => {
          Linking.openURL(
            'https://viewblock.io/arweave/tx/' + this.props.entity.permaweb_id,
          );
        },
      });
    }

    if (!entity.isOwner()) {
      // Report
      options.push({
        title: i18n.t('report'),
        iconName: 'ios-flag-outline',
        iconType: 'ionicon',
        onPress: () => {
          this.props.navigation.navigate('Report', {
            entity: this.props.entity,
          });
        },
      });

      const blocked = this.props.channel
        ? this.props.channel.blocked
        : this.state.userBlocked;

      // Block / Unblock
      options.push({
        title: blocked ? i18n.t('channel.unblock') : i18n.t('channel.block'),
        iconName: 'remove-circle-outline',
        iconType: 'ionicon',
        onPress: async () => {
          if (this.props.channel) {
            return this.props.channel?.toggleBlock();
          }

          if (!this.state.userBlocked) {
            try {
              await this.props.entity.blockOwner();
              this.setState({
                userBlocked: true,
              });
            } catch (err) {
              this.showError();
            }
          } else {
            try {
              await this.props.entity.unblockOwner();
              this.setState({
                userBlocked: false,
              });
            } catch (err) {
              this.showError();
            }
          }
        },
      });
    }
    // Copy URL
    options.push(
      copyToClipboardOptions(MINDS_URI + 'newsfeed/' + this.props.entity.guid),
    );
    // Share
    options.push({
      iconName: 'share-social',
      iconType: 'ionicon',
      title: i18n.t('share'),
      onPress: () => {
        if (IS_IOS) {
          this.share();
        } else {
          pushShareSheet({
            onSendTo: this.sendTo,
            onShare: this.share,
          });
        }
      },
    });

    options.push({
      iconName: entity['is:following'] ? 'bell-cancel' : 'bell',
      iconType: 'material-community',
      title: !entity['is:following'] ? i18n.t('follow') : i18n.t('unfollow'),
      onPress: async () => {
        try {
          await this.props.entity.toggleFollow();
        } catch (err) {
          this.showError();
        }
      },
    });

    // we use the group from the context, as the entity.containerObj is not updated
    const group = this.context?.group;

    // if can delete
    if (
      !isReminded &&
      (entity.isOwner() ||
        sessionService.getUser().isAdmin() ||
        (group && (group['is:owner'] || group['is:moderator'])))
    ) {
      options.push({
        iconName: 'delete',
        iconType: 'material-community',
        title: i18n.t('delete'),
        testID: 'deleteOption',
        onPress: () => {
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
        },
      });
    }

    if (entity.hasImage() && !(entity.shouldBeBlured() && IS_IOS)) {
      options.push({
        iconName: 'fullscreen',
        iconType: 'material-community',
        title: i18n.t('imageViewer'),
        onPress: () => {
          this.props.navigation.navigate('ImageGallery', {
            entity: this.props.entity,
          });
        },
      });
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
      if (isApiError(err)) {
        return this.showError(err?.message);
      }
      this.showError();
    }
  }

  /**
   * Send link to a user in chat
   */
  sendTo = async () => {
    try {
      const installed = await SendIntentAndroid.isAppInstalled(
        ANDROID_CHAT_APP,
      );
      if (installed) {
        SendIntentAndroid.sendText({
          title: '',
          text: MINDS_URI + 'newsfeed/' + this.props.entity.guid,
          type: SendIntentAndroid.TEXT_PLAIN,
          package: ANDROID_CHAT_APP,
        });
      } else if (!this.props.isChatHidden) {
        Linking.openURL('market://details?id=com.minds.chat');
      }
    } catch (error) {
      logService.exception(error);
      console.log(error);
    }
  };

  /**
   * Show an error message
   */
  showError(message?: string) {
    showNotification(
      message || i18n.t('errorMessage') + '\n' + i18n.t('activity.tryAgain'),
      'danger',
      2000,
    );
  }

  /**
   * Share the link to the post
   */
  share = () => {
    shareService.share(
      this.props.entity.text,
      MINDS_URI + 'newsfeed/' + this.props.entity.guid,
    );
  };

  copyToClipboard = () => {
    Clipboard.setString(MINDS_URI + 'newsfeed/' + this.props.entity.guid);
    showNotification(i18n.t('copied'));
  };

  /**
   * Render Header
   */
  render() {
    return (
      <IconButtonNext
        scale
        name="more"
        size="large"
        onPress={this.showActionSheet}
        testID={this.props.testID}
      />
    );
  }
}

const pushActionSheet = ({ options }: { options: any[] }) =>
  pushBottomSheet({
    safe: true,
    component: ref => {
      const onClosePress = async (onPress?: () => Promise<void>) => {
        await ref.close();
        await onPress?.();
      };

      return (
        <>
          {options.map(({ onPress, ...a }, i) => (
            <BottomSheetMenuItem
              {...{ ...a, onPress: () => onClosePress(onPress) }}
              key={i}
            />
          ))}
          <BottomSheetButton
            text={i18n.t('cancel')}
            onPress={() => ref.close()}
          />
        </>
      );
    },
  });

export const pushShareSheet = ({ onSendTo, onShare }) =>
  pushBottomSheet({
    safe: true,
    component: ref => (
      <>
        <BottomSheetMenuItem
          onPress={async () => {
            await ref.close();
            onSendTo();
          }}
          title={i18n.t('sendTo')}
          iconName="repeat"
          iconType="material"
        />
        <BottomSheetMenuItem
          title={i18n.t('share')}
          onPress={async () => {
            await ref.close();
            onShare();
          }}
          iconName="edit"
          iconType="material"
        />

        <BottomSheetButton text={i18n.t('cancel')} onPress={ref.close} />
      </>
    ),
  });

export default withChannelContext(withSafeAreaInsets(ActivityActionSheet));
