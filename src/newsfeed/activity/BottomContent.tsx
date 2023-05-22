import React from 'react';

import ActivityMetrics from './metrics/ActivityMetrics';
import Actions from './Actions';
import Scheduled from './banners/Scheduled';
import Pending from './banners/Pending';
import type ActivityModel from '../ActivityModel';
import { pushCommentBottomSheet } from '~/comments/v2/CommentBottomSheet';
import CommentsStore from '~/comments/v2/CommentsStore';
import { useAnalytics } from '~/common/contexts/analytics.context';
import { BoostCTA } from 'modules/boost';

type PropsType = {
  showOnlyContent?: boolean;
  entity: ActivityModel;
  hideTabs?: boolean;
  hideMetrics?: boolean;
};

const BottomContent = (props: PropsType) => {
  const shouldRender = !props.showOnlyContent;
  const analytics = useAnalytics();

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
    if (!props.entity.allow_comments) {
      return;
    }

    if (!commentsStore.current) {
      commentsStore.current = new CommentsStore(
        props.entity,
        analytics.contexts,
      );
    }

    pushCommentBottomSheet({
      commentsStore: commentsStore.current,
    });
  }, [props.entity, analytics]);

  if (!shouldRender) {
    return null;
  }

  return (
    <>
      <BoostCTA entity={props.entity} />
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
      <Pending isPending={props.entity.isPending()} />
    </>
  );
};

export default BottomContent;
