import React, { PureComponent } from 'react';
import { Alert, Linking } from 'react-native';
import { BottomSheetModal as BottomSheetModalType } from '@gorhom/bottom-sheet';
import {
  WithSafeAreaInsetsProps,
  withSafeAreaInsets,
} from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import SendIntentAndroid from 'react-native-send-intent';

import { IconButtonNext } from '~ui/icons';
import {
  ANDROID_CHAT_APP,
  BOOSTS_ENABLED,
  IS_IOS,
  APP_URI,
} from '../../config/Config';
import type ActivityModel from '../ActivityModel';
import { showNotification } from '../../../AppMessages';
import {
  BottomSheetButton,
  BottomSheetMenuItem,
  pushBottomSheet,
} from '../../common/components/bottom-sheet';
import { withChannelContext } from '~/channel/v2/ChannelContext';
import type UserModel from '~/channel/UserModel';
import { isApiError } from '~/common/services/ApiErrors';
import { GroupContext } from '~/modules/groups/contexts/GroupContext';
import { copyToClipboardOptions } from '~/common/helpers/copyToClipboard';
import serviceProvider from '~/services/serviceProvider';
import { openLinkInInAppBrowser } from '~/common/services/inapp-browser.service';

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
      this.props.entity['is:following'] = await serviceProvider
        .resolve('newsfeed')
        .isFollowing(this.props.entity.guid);
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
      iconName?: string;
      iconType?: string;
      icon?: JSX.Element;
      title: string;
      testID?: string;
      onPress: () => Promise<void> | void;
    }> = [];
    const i18n = serviceProvider.i18n;
    const entity = this.props.entity;
    const isReminded = entity.remind_users && entity.remind_users.length;

    const remindedByMe =
      entity.remind_users &&
      entity.remind_users.some(
        user => user.guid === serviceProvider.session.getUser().guid,
      );

    if (
      remindedByMe ||
      (isReminded && serviceProvider.session.getUser().isAdmin())
    ) {
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

    const externalData = entity.getExternalData();
    if (entity.canonical_url && externalData) {
      options.push({
        title: i18n.t('viewOnExternal', { external: externalData.source }),
        iconName: 'language',
        iconType: 'material',
        onPress: () => openLinkInInAppBrowser(entity.canonical_url),
      });
    }

    // if can edit
    if (entity.isOwner()) {
      // Edit
      serviceProvider.permissions.canComment() &&
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

      if (
        !entity.dontPin &&
        (this.props.channel || entity.containerObj?.type === 'group')
      ) {
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
      if (BOOSTS_ENABLED && serviceProvider.permissions.canBoost()) {
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
    }

    if (
      !!this.props.onTranslate &&
      serviceProvider.resolve('translation').isTranslatable(entity)
    ) {
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

    if (!entity.isOwner()) {
      // Report
      options.push({
        title: i18n.t('report'),
        iconName: 'flag-outline',
        iconType: 'ionicon',
        onPress: () => {
          this.props.navigation.navigate('Report', {
            entity: this.props.entity,
          });
        },
      });

      // Block / Unblock
      const blocked = this.props.channel
        ? this.props.channel.blocked
        : this.state.userBlocked;
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
      copyToClipboardOptions(APP_URI + 'newsfeed/' + this.props.entity.guid),
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
        serviceProvider.session.getUser().isAdmin() ||
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

      const state = serviceProvider.navigation.getCurrentState();

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
          text: APP_URI + 'newsfeed/' + this.props.entity.guid,
          type: SendIntentAndroid.TEXT_PLAIN,
          package: ANDROID_CHAT_APP,
        });
      } else if (!this.props.isChatHidden) {
        Linking.openURL('market://details?id=com.minds.chat');
      }
    } catch (error) {
      serviceProvider.log.exception(error);
      console.log(error);
    }
  };

  /**
   * Show an error message
   */
  showError(message?: string) {
    showNotification(
      message ||
        serviceProvider.i18n.t('errorMessage') +
          '\n' +
          serviceProvider.i18n.t('activity.tryAgain'),
      'danger',
      2000,
    );
  }

  /**
   * Share the link to the post
   */
  share = () => {
    serviceProvider
      .resolve('share')
      .share(
        this.props.entity.text,
        APP_URI + 'newsfeed/' + this.props.entity.guid,
      );
  };

  copyToClipboard = () => {
    Clipboard.setStringAsync(APP_URI + 'newsfeed/' + this.props.entity.guid);
    showNotification(serviceProvider.i18n.t('copied'));
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
            text={serviceProvider.i18n.t('cancel')}
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
          title={serviceProvider.i18n.t('sendTo')}
          iconName="repeat"
          iconType="material"
        />
        <BottomSheetMenuItem
          title={serviceProvider.i18n.t('share')}
          onPress={async () => {
            await ref.close();
            onShare();
          }}
          iconName="edit"
          iconType="material"
        />

        <BottomSheetButton
          text={serviceProvider.i18n.t('cancel')}
          onPress={ref.close}
        />
      </>
    ),
  });

export default withChannelContext(withSafeAreaInsets(ActivityActionSheet));
