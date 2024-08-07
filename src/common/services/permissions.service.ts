import { PermissionIntentTypeEnum, PermissionsEnum } from '~/graphql/api';
import i18n from './i18n.service';
import mindsConfigService, { PermissionIntent } from './minds-config.service';
import { showNotification } from 'AppMessages';
import { showUpgradeModal } from './upgrade-modal.service';

export default class PermissionsService {
  /**
   * Returns true if the user does not have the permission and the intent is to hide the element.
   * @param permissionId
   * @returns
   */
  private static shouldHide(permissionId: PermissionsEnum): boolean {
    return (
      !this.hasPermission(permissionId) &&
      mindsConfigService.getPermissionIntent(permissionId)?.intent_type ===
        PermissionIntentTypeEnum.Hide
    );
  }

  /**
   *
   * @param permissionId
   * @returns boolean
   */
  public static shouldShowWarningMessage(
    permissionId: PermissionsEnum,
  ): boolean {
    return (
      !this.hasPermission(permissionId) &&
      mindsConfigService.getPermissionIntent(permissionId)?.intent_type ===
        PermissionIntentTypeEnum.WarningMessage
    );
  }

  private static canPerformAction(
    permission: PermissionsEnum,
    handleAction = false,
  ) {
    if (handleAction) {
      return this.handleAction(permission);
    }
    return this.hasPermission(permission);
  }

  /**
   * Permissions check and action handling
   */

  public static canCreatePost(handleAction = false) {
    return this.canPerformAction(PermissionsEnum.CanCreatePost, handleAction);
  }

  public static canComment(handleAction = false) {
    return this.canPerformAction(PermissionsEnum.CanComment, handleAction);
  }

  public static canUploadVideo(handleAction = false) {
    return this.canPerformAction(PermissionsEnum.CanUploadVideo, handleAction);
  }

  public static canInteract(handleAction = false) {
    return this.canPerformAction(PermissionsEnum.CanInteract, handleAction);
  }

  public static canCreateGroup(handleAction = false) {
    return this.canPerformAction(PermissionsEnum.CanCreateGroup, handleAction);
  }

  public static canBoost(handleAction = false) {
    return this.canPerformAction(PermissionsEnum.CanBoost, handleAction);
  }

  public static canCreateChatRoom(handleAction = false) {
    return this.canPerformAction(
      PermissionsEnum.CanCreateChatRoom,
      handleAction,
    );
  }

  public static canUploadChatMedia(handleAction = false) {
    return this.canPerformAction(
      PermissionsEnum.CanUploadChatMedia,
      handleAction,
    );
  }

  /**
   * Should hide actions
   */

  public static shouldHideCreatePost() {
    return this.shouldHide(PermissionsEnum.CanCreatePost);
  }

  public static shouldHideComment() {
    return this.shouldHide(PermissionsEnum.CanComment);
  }

  public static shouldHideUploadVideo() {
    return this.shouldHide(PermissionsEnum.CanUploadVideo);
  }

  public static shouldHideInteract() {
    return this.shouldHide(PermissionsEnum.CanInteract);
  }

  public static shouldHideCreateGroup() {
    return this.shouldHide(PermissionsEnum.CanCreateGroup);
  }

  public static shouldHideBoost() {
    return this.shouldHide(PermissionsEnum.CanBoost);
  }

  public static shouldHideCreateChatRoom() {
    return this.shouldHide(PermissionsEnum.CanCreateChatRoom);
  }

  public static shouldHideUploadChatMedia() {
    return this.shouldHide(PermissionsEnum.CanUploadChatMedia);
  }

  public static getMessage(error: PermissionsKeys) {
    const message = {
      [PermissionsEnum.CanCreatePost]: i18n.t(
        'permissions.notAllowed.create_post',
      ),
      [PermissionsEnum.CanComment]: i18n.t(
        'permissions.notAllowed.create_comment',
      ),
      [PermissionsEnum.CanUploadVideo]: i18n.t(
        'permissions.notAllowed.upload_video',
      ),
      [PermissionsEnum.CanInteract]: i18n.t('permissions.notAllowed.interact'),
      [PermissionsEnum.CanCreateGroup]: i18n.t(
        'permissions.notAllowed.create_group',
      ),
      [PermissionsEnum.CanBoost]: i18n.t('permissions.notAllowed.boost'),
      [PermissionsEnum.CanCreateChatRoom]: i18n.t(
        'permissions.notAllowed.create_chat',
      ),
      [PermissionsEnum.CanUploadChatMedia]: i18n.t(
        'permissions.notAllowed.upload_chat_media',
      ),
    }[error];

    return message || i18n.t('notAllowed');
  }

  /**
   * Show a warning toast message when the user does not have permission to perform an action.
   * @param permission
   * @param showToaster
   * @returns
   */
  private static hasPermission(permission: PermissionsEnum) {
    return mindsConfigService.hasPermission(permission);
  }

  /**
   * Check whether the user has permission to perform an action,
   * and handle the action if appropriate.
   */
  private static handleAction(permissionId: PermissionsEnum): boolean {
    if (this.hasPermission(permissionId)) {
      return true;
    }

    const permissionIntent =
      mindsConfigService.getPermissionIntent(permissionId);

    if (!permissionIntent) {
      return false;
    }

    if (
      permissionIntent.intent_type === PermissionIntentTypeEnum.WarningMessage
    ) {
      showNotification(PermissionsService.getMessage(permissionId));
      return false;
    }
    if (permissionIntent.intent_type === PermissionIntentTypeEnum.Upgrade) {
      if (!permissionIntent?.membership_guid) {
        // fallback to showing a warning message.
        showNotification(PermissionsService.getMessage(permissionId));
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

  private static showMembershipModal(permissionIntent: PermissionIntent) {
    if (permissionIntent.membership_guid) {
      showUpgradeModal(permissionIntent.membership_guid);
    }
  }
}

type PermissionsKeys = `${PermissionsEnum}`;
