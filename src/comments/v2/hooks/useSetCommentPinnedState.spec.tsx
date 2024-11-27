import { renderHook } from '@testing-library/react-hooks';
import { useSetCommentPinnedState } from './useSetCommentPinnedState';
import { useSetCommentPinnedStateMutation } from '~/graphql/api';
import CommentsStore from '../CommentsStore';
import sp from '../../../services/__mocks__/serviceProvider';

jest.mock('~/graphql/api', () => ({
  useSetCommentPinnedStateMutation: jest.fn(),
}));

jest.mock('~/services/serviceProvider');
sp.mockService('log');

const mockMutate: jest.MockedFunction<any> = jest.fn();
const mockedUseSetCommentPinnedStateMutation: jest.MockedFunction<any> =
  useSetCommentPinnedStateMutation as jest.MockedFunction<any>;

describe('useSetCommentPinnedState', () => {
  let store: Partial<CommentsStore>;

  beforeEach(() => {
    jest.clearAllMocks();
    store = {
      setPinned: jest.fn(),
    };
    mockedUseSetCommentPinnedStateMutation.mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
      isError: false,
    });
  });

  it('should set comment pinned state successfully', async () => {
    const { result } = renderHook(() =>
      useSetCommentPinnedState(store as CommentsStore),
    );

    result.current.setCommentPinnedState('123', true);

    expect(mockMutate).toHaveBeenCalledWith({
      commentGuid: '123',
      pinned: true,
    });
  });

  it('should update store on successful mutation', () => {
    const setPinnedSpy = jest.spyOn(store, 'setPinned');

    mockedUseSetCommentPinnedStateMutation.mockImplementation(
      ({ onSuccess }) => {
        onSuccess(
          { setCommentPinnedState: true },
          { commentGuid: '123', pinned: true },
        );
        return {
          mutate: mockMutate,
          isLoading: false,
          isError: false,
        };
      },
    );

    renderHook(() => useSetCommentPinnedState(store as CommentsStore));

    expect(setPinnedSpy).toHaveBeenCalledWith('123', true);
  });

  it('should log error when mutation fails', () => {
    const error = new Error('Test error');

    mockedUseSetCommentPinnedStateMutation.mockImplementation(({ onError }) => {
      onError(error);
      return {
        mutate: mockMutate,
        isLoading: false,
        isError: true,
      };
    });

    renderHook(() => useSetCommentPinnedState(store as CommentsStore));

    expect(sp.log.exception).toHaveBeenCalledWith(
      'Error setting comment pinned state',
      error,
    );
  });

  it('should return loading and error states', () => {
    mockedUseSetCommentPinnedStateMutation.mockReturnValue({
      mutate: mockMutate,
      isLoading: true,
      isError: true,
    });

    const { result } = renderHook(() =>
      useSetCommentPinnedState(store as CommentsStore),
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(true);
  });
});
