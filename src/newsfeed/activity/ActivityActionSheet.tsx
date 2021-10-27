import React, { PureComponent } from 'react';
import { Alert, Linking } from 'react-native';
import { IconButtonNextSpaced } from '~ui/icons';
import { MINDS_URI } from '../../config/Config';
import { isFollowing } from '../NewsfeedService';
import shareService from '../../share/ShareService';
import i18n from '../../common/services/i18n.service';
import featuresService from '../../common/services/features.service';
import translationService from '../../common/services/translation.service';
import { FLAG_EDIT_POST } from '../../common/Permissions';
import sessionService from '../../common/services/session.service';
import NavigationService from '../../navigation/NavigationService';
import type ActivityModel from '../ActivityModel';
import { showNotification } from '../../../AppMessages';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomSheetModal,
  BottomSheetButton,
  MenuItem,
} from '../../common/components/bottom-sheet';

type PropsType = {
  entity: ActivityModel;
  onTranslate?: Function;
  testID?: string;
  navigation: any;
  insets?: {
    bottom: number;
  };
};

type StateType = {
  options: Array<any>;
  userBlocked: boolean;
  shown: boolean;
};

/**
 * Activity Actions Component
 */
export default withSafeAreaInsets(
  class ActivityActionSheet extends PureComponent<PropsType, StateType> {
    ref = React.createRef<any>();
    deleteOption: React.ReactNode;
    state: StateType = {
      options: [],
      userBlocked: false,
      shown: false,
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
        if (!this.state.shown) {
          this.setState({ shown: true });
        } else {
          this.ref.current?.present();
        }
      });
    };

    /**
     * Hide menu
     */
    hideActionSheet = () => {
      this.ref.current?.dismiss();
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
        onPress: () => void;
      }> = [];

      const entity = this.props.entity;

      const reminded =
        entity.remind_users &&
        entity.remind_users.some(
          user => user.guid === sessionService.getUser().guid,
        );

      if (reminded) {
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
            this.hideActionSheet();
          },
        });
      }

      // if can edit
      if (
        entity.isOwner() ||
        (featuresService.has('permissions') && entity.can(FLAG_EDIT_POST))
      ) {
        // Edit
        options.push({
          title: i18n.t('edit'),
          iconName: 'edit',
          iconType: 'material',
          onPress: async () => {
            this.props.navigation.navigate('Capture', {
              isEdit: true,
              entity: this.props.entity,
            });
            this.hideActionSheet();
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
            this.hideActionSheet();
            try {
              await this.props.entity.toggleExplicit();
            } catch (err) {
              this.showError();
            }
          },
        });

        if (!entity.dontPin) {
          // Pin / Unpin
          options.push({
            title: !entity.pinned ? i18n.t('pin') : i18n.t('unpin'),
            iconName: 'pin-outline',
            iconType: 'material-community',
            onPress: async () => {
              this.props.entity.togglePin();
              this.hideActionSheet();
            },
          });
        }

        if (featuresService.has('allow-comments-toggle')) {
          // Toggle comments
          options.push({
            title: entity.allow_comments
              ? i18n.t('disableComments')
              : i18n.t('enableComments'),
            iconName: 'pin-outline',
            iconType: 'material-community',
            onPress: async () => {
              try {
                this.hideActionSheet();
                await this.props.entity.toggleAllowComments();
              } catch (err) {
                this.showError();
              }
            },
          });
        }
      }

      if (
        !!this.props.onTranslate &&
        translationService.isTranslatable(entity)
      ) {
        // Translate
        options.push({
          title: i18n.t('translate.translate'),
          iconName: 'translate',
          iconType: 'material',
          onPress: () => {
            if (this.props.onTranslate) this.props.onTranslate();
            this.hideActionSheet();
          },
        });
      }

      // Permaweb
      if (featuresService.has('permaweb') && entity.permaweb_id) {
        options.push({
          title: i18n.t('permaweb.viewOnPermaweb'),
          iconName: 'format-paragraph',
          iconType: 'material-community',
          onPress: () => {
            this.hideActionSheet();
            Linking.openURL(
              'https://viewblock.io/arweave/tx/' +
                this.props.entity.permaweb_id,
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
            this.hideActionSheet();
            this.props.navigation.navigate('Report', {
              entity: this.props.entity,
            });
          },
        });

        // Block / Unblock
        options.push({
          title: this.state.userBlocked
            ? i18n.t('channel.unblock')
            : i18n.t('channel.block'),
          iconName: 'remove-circle-outline',
          iconType: 'ionicon',
          onPress: async () => {
            this.hideActionSheet();
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
      // Share
      options.push({
        iconName: 'share-social',
        iconType: 'ionicon',
        title: i18n.t('share'),
        onPress: () => {
          this.hideActionSheet();
          shareService.share(
            this.props.entity.text,
            MINDS_URI + 'newsfeed/' + this.props.entity.guid,
          );
        },
      });

      options.push({
        iconName: entity['is:following'] ? 'bell-cancel' : 'bell',
        iconType: 'material-community',
        title: !entity['is:following'] ? i18n.t('follow') : i18n.t('unfollow'),
        onPress: async () => {
          this.hideActionSheet();

          try {
            await this.props.entity.toggleFollow();
          } catch (err) {
            this.showError();
          }
        },
      });

      // if can delete
      if (
        entity.isOwner() ||
        sessionService.getUser().isAdmin() ||
        (entity.containerObj && entity.containerObj['is:owner'])
      ) {
        options.push({
          iconName: 'delete',
          iconType: 'material-community',
          title: i18n.t('delete'),
          testID: 'deleteOption',
          onPress: () => {
            this.hideActionSheet();
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

      if (entity.hasImage()) {
        options.push({
          iconName: 'fullscreen',
          iconType: 'material-community',
          title: i18n.t('imageViewer'),
          onPress: () => {
            this.hideActionSheet();
            const source = this.props.entity.getThumbSource('xlarge');
            this.props.navigation.navigate('ViewImage', {
              entity: this.props.entity,
              source,
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
        this.showError();
      }
    }

    /**
     * Show an error message
     */
    showError() {
      showNotification(
        i18n.t('errorMessage') + '\n' + i18n.t('activity.tryAgain'),
        'warning',
        2000,
        'top',
      );
    }

    /**
     * Render Header
     */
    render() {
      return (
        <>
          <IconButtonNextSpaced
            scale
            name="more"
            size="large"
            onPress={this.showActionSheet}
            testID={this.props.testID}
            // left="XS"
          />
          {this.state.shown && (
            <BottomSheetModal ref={this.ref} autoShow>
              {this.state.options.map((a, i) => (
                <MenuItem {...a} key={i} />
              ))}
              <BottomSheetButton
                text={i18n.t('cancel')}
                onPress={this.hideActionSheet}
              />
            </BottomSheetModal>
          )}
        </>
      );
    }
  },
);
