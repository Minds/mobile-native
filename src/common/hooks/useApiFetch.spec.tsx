import { renderHook, act } from '@testing-library/react-hooks';
import useApiFetch from './useApiFetch';
import { ApiService } from '../services/api.service';
import sp from '~/services/serviceProvider';
import { Lifetime } from '~/services/InjectionContainer';

jest.mock('../services/api.service');

// @ts-ignore
const mockedApi = new ApiService() as jest.Mocked<ApiService>;

sp.register('api', () => mockedApi, Lifetime.Singleton);

describe('useApiFetch', () => {
  beforeEach(() => {
    mockedApi.get.mockClear();
  });

  it('should make the call on mount', () => {
    const { result } = renderHook(() => useApiFetch('/api/users'));

    expect(mockedApi.get).toBeCalledWith('/api/users', {}, result.current);
  });

  it('shouldn`t repeat the call on re-renders', () => {
    const { result, rerender } = renderHook(() => useApiFetch('/api/users'));

    expect(mockedApi.get).toBeCalledWith('/api/users', {}, result.current);

    rerender();

    expect(mockedApi.get).toBeCalledTimes(1);
  });

  it('should make another call if url changes', () => {
    const { result, rerender } = renderHook(({ url }) => useApiFetch(url), {
      initialProps: { url: '/api/user1' },
    });

    expect(mockedApi.get).toBeCalledWith('/api/user1', {}, result.current);

    rerender({ url: '/api/user2' });

    expect(mockedApi.get).toBeCalledWith('/api/user2', {}, result.current);
  });

  it('avoid the call on mount', () => {
    const { result } = renderHook(() =>
      useApiFetch('/api/users', { skip: true }),
    );

    expect(mockedApi.get).toBeCalledTimes(0);

    // manually fetch
    act(() => {
      result.current.fetch();
    });

    expect(mockedApi.get).toBeCalledWith('/api/users', {}, result.current);
    expect(mockedApi.get).toBeCalledTimes(1);
  });

  it('should make a call every time the params change', () => {
    const { result, rerender } = renderHook(
      ({ url, opts }) => useApiFetch(url, opts),
      {
        initialProps: {
          url: '/api/user',
          opts: { params: { p1: 'somevalue' } },
        },
      },
    );

    expect(mockedApi.get).toBeCalledWith(
      '/api/user',
      { p1: 'somevalue' },
      result.current,
    );

    rerender({ url: '/api/user', opts: { params: { p1: 'diffvalue' } } });

    expect(mockedApi.get).toBeCalledWith(
      '/api/user',
      { p1: 'diffvalue' },
      result.current,
    );
  });
});
