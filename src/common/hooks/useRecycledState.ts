import React from 'react';
import useForceRender from './useForceRender';

/**
 * A recycler friendly state hook
 * use the identity to define if the initial state should be used
 */
export default function useRecycledState<T = any>(
  initialState: T,
  recyclerId: any,
): [T, (newState: T) => void] {
  const forceRender = useForceRender();
  const ref = React.useRef({ state: initialState, recyclerId });

  if (ref.current.recyclerId !== recyclerId) {
    ref.current = { state: initialState, recyclerId };
  }

  return [
    ref.current.state,
    React.useCallback(
      (newState: T) => {
        ref.current = { state: newState, recyclerId };
        forceRender();
      },
      [forceRender, recyclerId],
    ),
  ];
}
