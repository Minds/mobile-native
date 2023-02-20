import NavigationService from '~/navigation/NavigationService';

export default function requireInAppVerification() {
  return new Promise<boolean>((resolve, reject) => {
    NavigationService.navigate('InAppVerification', {
      onSuccess: resolve,
      onClose: reject,
    });
  });
}
