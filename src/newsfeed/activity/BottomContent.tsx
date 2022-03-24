import React from 'react';
import type BottomSheet from '@gorhom/bottom-sheet';

import ActivityMetrics from './metrics/ActivityMetrics';
import Actions from './Actions';
import Scheduled from './banners/Scheduled';
import Pending from './banners/Pending';
import type ActivityModel from '../ActivityModel';
import CommentBottomSheet from '~/comments/v2/CommentBottomSheet';
import CommentsStore from '~/comments/v2/CommentsStore';

type PropsType = {
  showOnlyContent?: boolean;
  entity: ActivityModel;
  hideTabs?: boolean;
};

const BottomContent = (props: PropsType) => {
  const shouldRender = !props.showOnlyContent;
  const commentsRef = React.useRef<BottomSheet>(null);
  const [commentStore, setCommentStore] = React.useState<null | CommentsStore>(
    null,
  );

  const onPressComment = React.useCallback(() => {
    if (!commentStore) {
      setCommentStore(new CommentsStore(props.entity));
    }
    if (commentsRef.current?.expand) {
      commentsRef.current.expand();
    }
  }, [commentStore, props.entity]);
  if (!shouldRender) {
    return null;
  }

  return (
    <>
      <ActivityMetrics entity={props.entity} />
      <Actions
        onPressComment={onPressComment}
        entity={props.entity}
        hideTabs={props.hideTabs}
      />
      {props.entity.isOwner() && (
        <Scheduled
          isScheduled={props.entity.isScheduled()}
          time_created={props.entity.time_created}
        />
      )}
      {commentStore && (
        <CommentBottomSheet
          ref={commentsRef}
          autoOpen={true}
          commentsStore={commentStore}
        />
      )}
      <Pending isPending={props.entity.isPending()} />
    </>
  );
};

export default BottomContent;
