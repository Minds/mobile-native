import React from 'react';
import type BottomSheet from '@gorhom/bottom-sheet';

import ActivityMetrics from './metrics/ActivityMetrics';
import Actions from './Actions';
import Scheduled from './banners/Scheduled';
import Pending from './banners/Pending';
import type ActivityModel from '../ActivityModel';
import CommentBottomSheet from '~/comments/v2/CommentBottomSheet';
import CommentsStore from '~/comments/v2/CommentsStore';
import useForceRender from '~/common/hooks/useForceRender';
import { useAnalytics } from '~/common/contexts/analytics.context';

type PropsType = {
  showOnlyContent?: boolean;
  entity: ActivityModel;
  hideTabs?: boolean;
  hideMetrics?: boolean;
};

const BottomContent = (props: PropsType) => {
  const shouldRender = !props.showOnlyContent;
  const commentsRef = React.useRef<BottomSheet>(null);
  const analytics = useAnalytics();

  const forceRender = useForceRender();

  // we use a reference instead of the state to avoid re-rendering the component
  const commentsStore = React.useRef<null | CommentsStore>(null);

  // if there is a store of a different entity (after a recycle), we remove it
  if (
    commentsStore.current &&
    commentsStore.current.entity.urn !== props.entity.urn
  ) {
    commentsStore.current = null;
  }

  const onPressComment = React.useCallback(() => {
    if (!commentsStore.current) {
      commentsStore.current = new CommentsStore(
        props.entity,
        analytics.contexts,
      );
      // we force the render to shown the bottom sheet
      forceRender();
    }
    if (commentsRef.current?.expand) {
      commentsRef.current.expand();
    }
  }, [props.entity, forceRender, analytics]);

  if (!shouldRender) {
    return null;
  }

  return (
    <>
      {!props.hideMetrics && (
        <ActivityMetrics
          entity={props.entity}
          hideSupermindLabel={props.hideTabs}
        />
      )}
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
      {commentsStore.current && (
        <CommentBottomSheet
          ref={commentsRef}
          autoOpen={true}
          commentsStore={commentsStore.current}
        />
      )}
      <Pending isPending={props.entity.isPending()} />
    </>
  );
};

export default BottomContent;
