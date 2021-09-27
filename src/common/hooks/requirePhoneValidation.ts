import NavigationService from '../../navigation/NavigationService';

export default async function requirePhoneValidation(description?: string) {
  const promise = new Promise<boolean>((resolve, reject) => {
    NavigationService.navigate('PhoneValidation', {
      onConfirm: resolve,
      onCancel: reject,
      description,
    });
  });

  return await promise;
}
