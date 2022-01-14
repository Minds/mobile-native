import { useCallback } from 'react';
import debounce from 'lodash/debounce';

export default function useDebouncedCallback(
  fn: any,
  time: number = 300,
  deps: any[],
) {
  return useCallback(debounce(fn, time), [time, ...deps]);
}
