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
    return this.hasPermission('CAN_CREATE_POST', showMessage);
  }

  public static canComment(showMessage = false) {
    return this.hasPermission('CAN_COMMENT', showMessage);
  }

  public static canUploadVideo(showMessage = false) {
    return this.hasPermission('CAN_UPLOAD_VIDEO', showMessage);
  }

  public static canInteract(showMessage = false) {
    return this.hasPermission('CAN_INTERACT', showMessage);
  }

  public static canCreateGroup(showMessage = false) {
    return this.hasPermission('CAN_CREATE_GROUP', showMessage);
  }

  public static canBoost(showMessage = false) {
    return this.hasPermission('CAN_BOOST', showMessage);
  }

  public static getMessage(error: PermissionsKeys) {
    const message = {
      CAN_CREATE_POST: i18n.t('permissions.notAllowed.create_post'),
      CAN_COMMENT: i18n.t('permissions.notAllowed.create_comment'),
      CAN_UPLOAD_VIDEO: i18n.t('permissions.notAllowed.upload_video'),
      CAN_INTERACT: i18n.t('permissions.notAllowed.interact'),
      CAN_CREATE_GROUP: i18n.t('permissions.notAllowed.create_group'),
      CAN_BOOST: i18n.t('permissions.notAllowed.boost'),
    }[error];

    return message || i18n.t('notAllowed');
  }
}

type PermissionsKeys = `${PermissionsEnum}`;
