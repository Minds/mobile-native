import { hasVariation } from 'ExperimentsProvider';
import NavigationService from '~/navigation/NavigationService';

export default function requireUniquenessVerification() {
  if (hasVariation('mob-4472-in-app-verification')) {
    return new Promise<boolean>((resolve, reject) => {
      NavigationService.navigate('InAppVerification', {
        onSuccess: resolve,
        onClose: reject,
      });
    });
  } else {
    return new Promise<boolean>((resolve, reject) => {
      NavigationService.navigate('PhoneValidation', {
        onConfirm: resolve,
        onCancel: reject,
      });
    });
  }
}
