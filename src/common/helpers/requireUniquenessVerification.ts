import NavigationService from '~/navigation/NavigationService';

export default function requireUniquenessVerification() {
  return new Promise<boolean>((resolve, reject) => {
    NavigationService.navigate('PhoneValidation', {
      onConfirm: resolve,
      onCancel: reject,
    });
  });
}
