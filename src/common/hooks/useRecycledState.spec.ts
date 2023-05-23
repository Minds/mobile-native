import { renderHook, act } from '@testing-library/react-hooks';
import useRecycledState from './useRecycledState';

describe('useRecycledState', () => {
  it('it should return the initial state', () => {
    const { result } = renderHook(() => useRecycledState(0, 'a'));
    const [state] = result.current;

    expect(state).toBe(0);
  });

  it('it should set the state', () => {
    const { result } = renderHook(() => useRecycledState(0, 'a'));
    let [state, setState] = result.current;

    expect(state).toBe(0);
    act(() => {
      setState(1);
    });

    [state] = result.current;

    expect(state).toBe(1);
  });

  it('it should reset the state if the recyclerId change', () => {
    const { result, rerender } = renderHook(
      ({ recyclerId }) => useRecycledState(0, recyclerId),
      {
        initialProps: { recyclerId: 'id1' },
      },
    );
    let [state, setState] = result.current;
    // initial state should be 0
    expect(state).toBe(0);
    act(() => {
      setState(1);
    });

    [state] = result.current;

    // state should be 1
    expect(state).toBe(1);

    rerender({ recyclerId: 'id2' });

    [state] = result.current;

    // state should be 0 (initial state because the recyclerId changed)
    expect(state).toBe(0);
  });
});
