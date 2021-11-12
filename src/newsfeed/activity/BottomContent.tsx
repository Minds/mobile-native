import React from 'react';
import ActivityMetrics from './metrics/ActivityMetrics';
import Actions from './Actions';
import Scheduled from './banners/Scheduled';
import Pending from './banners/Pending';
import type ActivityModel from '../ActivityModel';

type PropsType = {
  showOnlyContent?: boolean;
  entity: ActivityModel;
  showCommentsOutlet?: boolean;
  hideTabs?: boolean;
};

const BottomContent = (props: PropsType) => {
  const shouldRender = !props.showOnlyContent;
  if (!shouldRender) {
    return null;
  }

  return (
    <>
      <ActivityMetrics entity={props.entity} />
      <Actions
        entity={props.entity}
        showCommentsOutlet={props.showCommentsOutlet}
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
