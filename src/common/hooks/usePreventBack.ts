import { useBackHandler } from '@react-native-community/hooks';
import { useCallback } from 'react';

export default function usePreventBack() {
  return useBackHandler(
    useCallback(() => {
      return true;
    }, []),
  );
}
