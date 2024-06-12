import { PermissionsEnum } from '~/graphql/api';
import i18n from './i18n.service';
import mindsConfigService from './minds-config.service';
import { showNotification } from 'AppMessages';

export default class PermissionsService {
  private static hasPermission(
    permission: PermissionsKeys,
    showToaster = false,
  ) {
    const permissionValue = mindsConfigService.hasPermission(permission);
    if (!permissionValue && showToaster) {
      showNotification(PermissionsService.getMessage(permission));
    }
    return permissionValue;
  }

  public static canCreatePost(showMessage = false) {
    return this.hasPermission(PermissionsEnum.CanCreatePost, showMessage);
  }

  public static canComment(showMessage = false) {
    return this.hasPermission(PermissionsEnum.CanComment, showMessage);
  }

  public static canUploadVideo(showMessage = false) {
    return this.hasPermission(PermissionsEnum.CanUploadVideo, showMessage);
  }

  public static canInteract(showMessage = false) {
    return this.hasPermission(PermissionsEnum.CanInteract, showMessage);
  }

  public static canCreateGroup(showMessage = false) {
    return this.hasPermission(PermissionsEnum.CanCreateGroup, showMessage);
  }

  public static canBoost(showMessage = false) {
    return this.hasPermission(PermissionsEnum.CanBoost, showMessage);
  }

  public static canCreateChatRoom(showMessage = false) {
    return this.hasPermission(PermissionsEnum.CanCreateChatRoom, showMessage);
  }

  public static canUploadChatMedia(showMessage = false) {
    return this.hasPermission(PermissionsEnum.CanUploadChatMedia, showMessage);
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
}

type PermissionsKeys = `${PermissionsEnum}`;
