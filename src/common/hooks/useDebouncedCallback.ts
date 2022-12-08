import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import { useCallback, useRef } from 'react';

export default function useDebouncedCallback(
  fn: any,
  time: number = 300,
  deps: any[],
) {
  return useCallback(debounce(fn, time), [time, ...deps]);
}

export function useThrottledCallback(fn: any, time: number = 300, deps: any[]) {
  const throttled = useRef(
    throttle(fn, time, {
      trailing: false,
    }),
  ).current;
  return useCallback(
    (...args) => throttled(...args),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [time, ...deps],
  );
}
