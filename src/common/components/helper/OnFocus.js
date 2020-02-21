import React from 'react';
import { useFocusEffect } from '@react-navigation/native';

/**
 * Calls the onFocus callback when the container screen is focused in the navigator
 *
 * @param {Object} props
 */
export default function OnFocus({ onFocus }) {
  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = onFocus();

      // return a unsubscribe function when the component is destroyed?
      if (unsubscribe instanceof Function) {
        return () => unsubscribe();
      }
    }, [onFocus])
  );

  return null;
};
