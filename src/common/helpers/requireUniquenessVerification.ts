import sp from '~/services/serviceProvider';

export default function requireUniquenessVerification() {
  return new Promise<boolean>((resolve, reject) => {
    sp.navigation.navigate('PhoneValidation', {
      onConfirm: resolve,
      onCancel: reject,
    });
  });
}
