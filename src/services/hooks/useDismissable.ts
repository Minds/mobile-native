import { useCallback } from 'react';
import { useLegacyStores } from '~/common/hooks/use-stores';
import { DismissIdentifier } from '~/common/stores/DismissalStore';

export default function useDismissible(key: DismissIdentifier) {
  const { dismissal } = useLegacyStores();
  return {
    isDismissed: dismissal.isDismissed(key),
    dismiss: useCallback(() => dismissal.dismiss(key), [key, dismissal]),
  };
}
