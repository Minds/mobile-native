import React from 'react';
import { useFocusEffect } from '@react-navigation/native';

type PropsType = {
  onFocus: Function;
  notifications: any;
};

/**
 * Calls the onFocus callback when the container screen is focused in the navigator
 *
 * @param {Object} props
 */
export default function OnFocus({ onFocus, notifications }: PropsType) {
  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = onFocus(notifications);

      // return a unsubscribe function when the component is destroyed?
      if (unsubscribe instanceof Function) {
        return () => unsubscribe();
      }
    }, [onFocus, notifications]),
  );

  return null;
}
