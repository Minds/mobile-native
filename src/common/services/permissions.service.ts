import mindsConfigService from './minds-config.service';

export default class PermissionsService {
  public static canCreatePost() {
    return mindsConfigService.hasPermission('CAN_CREATE_POST');
  }

  public static canComment() {
    return mindsConfigService.hasPermission('CAN_COMMENT');
  }

  public static canUploadVideo() {
    return mindsConfigService.hasPermission('CAN_UPLOAD_VIDEO');
  }

  public static canInteract() {
    return mindsConfigService.hasPermission('CAN_INTERACT');
  }

  public static canCreateGroup() {
    return mindsConfigService.hasPermission('CAN_CREATE_GROUP');
  }

  public static canBoost() {
    return mindsConfigService.hasPermission('CAN_BOOST');
  }
}
