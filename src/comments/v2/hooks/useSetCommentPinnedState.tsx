import { useCallback } from 'react';
import {
  SetCommentPinnedStateMutation,
  useSetCommentPinnedStateMutation,
} from '~/graphql/api';
import sp from '~/services/serviceProvider';
import CommentsStore from '../CommentsStore';

type UseSetCommentPinnedStateReturnType = {
  setCommentPinnedState: (commentGuid: string, pinned: boolean) => void;
  isLoading: boolean;
  isError: boolean;
};

/**
 * Custom hook to set the pinned state of a comment.
 * @param { CommentsStore } store - The CommentsStore instance to update.
 * @returns { UseSetCommentPinnedStateReturnType } - return object with function to call.
 */
export function useSetCommentPinnedState(
  store: CommentsStore,
): UseSetCommentPinnedStateReturnType {
  const mutation = useSetCommentPinnedStateMutation({
    onSuccess: (
      mutation: SetCommentPinnedStateMutation,
      request: {
        commentGuid: string;
        pinned: boolean;
      },
    ) => {
      store.setPinned(request.commentGuid, request.pinned);
    },
    onError: (error: unknown) => {
      sp.log.exception('Error setting comment pinned state', error);
    },
  });

  const setCommentPinnedState = useCallback(
    (commentGuid: string, pinned: boolean) => {
      mutation.mutate({
        commentGuid: commentGuid,
        pinned,
      });
    },
    [mutation],
  );

  return {
    setCommentPinnedState,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
  };
}
