import { PermissionsEnum } from '~/graphql/api';
import { showNotification } from 'AppMessages';
import type { I18nService } from './i18n.service';
import type { MindsConfigService } from './minds-config.service';

export class PermissionsService {
  constructor(private i18n: I18nService, private config: MindsConfigService) {}

  private hasPermission(permission: PermissionsKeys, showToaster = false) {
    const permissionValue = this.config.hasPermission(permission);
    if (!permissionValue && showToaster) {
      showNotification(this.getMessage(permission));
    }
    return permissionValue;
  }

  public canCreatePost(showMessage = false) {
    return this.hasPermission(PermissionsEnum.CanCreatePost, showMessage);
  }

  public canComment(showMessage = false) {
    return this.hasPermission(PermissionsEnum.CanComment, showMessage);
  }

  public canUploadVideo(showMessage = false) {
    return this.hasPermission(PermissionsEnum.CanUploadVideo, showMessage);
  }

  public canInteract(showMessage = false) {
    return this.hasPermission(PermissionsEnum.CanInteract, showMessage);
  }

  public canCreateGroup(showMessage = false) {
    return this.hasPermission(PermissionsEnum.CanCreateGroup, showMessage);
  }

  public canBoost(showMessage = false) {
    return this.hasPermission(PermissionsEnum.CanBoost, showMessage);
  }

  public canCreateChatRoom(showMessage = false) {
    return this.hasPermission(PermissionsEnum.CanCreateChatRoom, showMessage);
  }

  public canUploadChatMedia(showMessage = false) {
    return this.hasPermission(PermissionsEnum.CanUploadChatMedia, showMessage);
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
}

type PermissionsKeys = `${PermissionsEnum}`;
