import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import { useCallback } from 'react';

export default function useDebouncedCallback(
  fn: any,
  time: number = 300,
  deps: any[],
) {
  return useCallback(debounce(fn, time), [time, ...deps]);
}

export function useThrottledCallback(fn: any, time: number = 300, deps: any[]) {
  return useCallback(
    throttle(fn, time, {
      trailing: false,
    }),
    [time, ...deps],
  );
}
