import { PermissionIntentTypeEnum, PermissionsEnum } from '~/graphql/api';
import { showNotification } from 'AppMessages';
import type { I18nService } from './i18n.service';
import type {
  MindsConfigService,
  PermissionIntent,
} from './minds-config.service';
import { showUpgradeModal } from './upgrade-modal.service';

export class PermissionsService {
  constructor(private i18n: I18nService, private config: MindsConfigService) {}

  /**
   * Returns true if the user does not have the permission and the intent is to hide the element.
   * @param permissionId
   * @returns
   */
  private shouldHide(permissionId: PermissionsEnum): boolean {
    return (
      !this.hasPermission(permissionId) &&
      this.config.getPermissionIntent(permissionId)?.intent_type ===
        PermissionIntentTypeEnum.Hide
    );
  }

  /**
   *
   * @param permissionId
   * @returns boolean
   */
  public shouldShowWarningMessage(permissionId: PermissionsEnum): boolean {
    return (
      !this.hasPermission(permissionId) &&
      this.config.getPermissionIntent(permissionId)?.intent_type ===
        PermissionIntentTypeEnum.WarningMessage
    );
  }

  private canPerformAction(permission: PermissionsEnum, handleAction = false) {
    if (handleAction) {
      return this.handleAction(permission);
    }
    return this.hasPermission(permission);
  }

  /**
   * Permissions check and action handling
   */

  public canCreatePost(handleAction = false) {
    return this.canPerformAction(PermissionsEnum.CanCreatePost, handleAction);
  }

  public canComment(handleAction = false) {
    return this.canPerformAction(PermissionsEnum.CanComment, handleAction);
  }

  public canUploadVideo(handleAction = false) {
    return this.canPerformAction(PermissionsEnum.CanUploadVideo, handleAction);
  }

  public canInteract(handleAction = false) {
    return this.canPerformAction(PermissionsEnum.CanInteract, handleAction);
  }

  public canCreateGroup(handleAction = false) {
    return this.canPerformAction(PermissionsEnum.CanCreateGroup, handleAction);
  }

  public canBoost(handleAction = false) {
    return this.canPerformAction(PermissionsEnum.CanBoost, handleAction);
  }

  public canCreateChatRoom(handleAction = false) {
    return this.canPerformAction(
      PermissionsEnum.CanCreateChatRoom,
      handleAction,
    );
  }

  public canUploadChatMedia(handleAction = false) {
    return this.canPerformAction(
      PermissionsEnum.CanUploadChatMedia,
      handleAction,
    );
  }

  /**
   * Should hide actions
   */

  public shouldHideCreatePost() {
    return this.shouldHide(PermissionsEnum.CanCreatePost);
  }

  public shouldHideComment() {
    return this.shouldHide(PermissionsEnum.CanComment);
  }

  public shouldHideUploadVideo() {
    return this.shouldHide(PermissionsEnum.CanUploadVideo);
  }

  public shouldHideInteract() {
    return this.shouldHide(PermissionsEnum.CanInteract);
  }

  public shouldHideCreateGroup() {
    return this.shouldHide(PermissionsEnum.CanCreateGroup);
  }

  public shouldHideBoost() {
    return this.shouldHide(PermissionsEnum.CanBoost);
  }

  public shouldHideCreateChatRoom() {
    return this.shouldHide(PermissionsEnum.CanCreateChatRoom);
  }

  public shouldHideUploadChatMedia() {
    return this.shouldHide(PermissionsEnum.CanUploadChatMedia);
  }

  public getMessage(error: PermissionsKeys) {
    const message = {
      [PermissionsEnum.CanCreatePost]: this.i18n.t(
        'permissions.notAllowed.create_post',
      ),
      [PermissionsEnum.CanComment]: this.i18n.t(
        'permissions.notAllowed.create_comment',
      ),
      [PermissionsEnum.CanUploadVideo]: this.i18n.t(
        'permissions.notAllowed.upload_video',
      ),
      [PermissionsEnum.CanInteract]: this.i18n.t(
        'permissions.notAllowed.interact',
      ),
      [PermissionsEnum.CanCreateGroup]: this.i18n.t(
        'permissions.notAllowed.create_group',
      ),
      [PermissionsEnum.CanBoost]: this.i18n.t('permissions.notAllowed.boost'),
      [PermissionsEnum.CanCreateChatRoom]: this.i18n.t(
        'permissions.notAllowed.create_chat',
      ),
      [PermissionsEnum.CanUploadChatMedia]: this.i18n.t(
        'permissions.notAllowed.upload_chat_media',
      ),
    }[error];

    return message || this.i18n.t('notAllowed');
  }

  /**
   * Show a warning toast message when the user does not have permission to perform an action.
   * @param permission
   * @param showToaster
   * @returns
   */
  private hasPermission(permission: PermissionsEnum) {
    return this.config.hasPermission(permission);
  }

  /**
   * Check whether the user has permission to perform an action,
   * and handle the action if appropriate.
   */
  private handleAction(permissionId: PermissionsEnum): boolean {
    if (this.hasPermission(permissionId)) {
      return true;
    }

    const permissionIntent = this.config.getPermissionIntent(permissionId);

    if (!permissionIntent) {
      return false;
    }

    if (
      permissionIntent.intent_type === PermissionIntentTypeEnum.WarningMessage
    ) {
      showNotification(this.getMessage(permissionId));
      return false;
    }
    if (permissionIntent.intent_type === PermissionIntentTypeEnum.Upgrade) {
      if (!permissionIntent?.membership_guid) {
        // fallback to showing a warning message.
        showNotification(this.getMessage(permissionId));
        console.warn(
          'No membership guid found in permission intent',
          permissionIntent,
        );
        return false;
      }
      this.showMembershipModal(permissionIntent);
      return false;
    }

    return false;
  }

  private showMembershipModal(permissionIntent: PermissionIntent) {
    if (permissionIntent.membership_guid) {
      showUpgradeModal(permissionIntent.membership_guid);
    }
  }
}

type PermissionsKeys = `${PermissionsEnum}`;
