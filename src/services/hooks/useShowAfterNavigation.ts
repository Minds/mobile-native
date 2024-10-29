import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

export const useShowAfterNavigation = () => {
  const isFocused = useIsFocused();
  const [showInteractions, setShowInteractions] = useState(false);

  useEffect(() => {
    if (isFocused) {
      // Delay rendering of Interactions slightly to ensure transition is complete
      const timer = setTimeout(() => setShowInteractions(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowInteractions(false);
    }
  }, [isFocused]);

  return showInteractions;
};
