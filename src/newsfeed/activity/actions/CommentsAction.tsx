import React from 'react';
import { IconButtonNext } from '~ui/icons';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import type BlogModel from '../../../blogs/BlogModel';
import { actionsContainerStyle } from './styles';
import EntityCounter from './EntityCounter';
import { observer } from 'mobx-react';

type PropsType = {
  entity: ActivityModel | BlogModel;
  testID?: string;
  navigation: any;
  hideCount?: boolean;
  onPressComment: () => void;
};

/**
 * Comments Action Component
 */
const CommentsAction = (props: PropsType) => {
  const icon = props.entity.allow_comments ? 'chat-solid' : 'chat-off';

  return (
    <IconButtonNext
      style={actionsContainerStyle}
      scale
      name={icon}
      size="small"
      fill
      disabled={
        !props.entity.allow_comments && props.entity['comments:count'] === 0
      }
      onPress={props.onPressComment}
      testID={props.testID}
      extra={
        !props.hideCount ? (
          <EntityCounter entity={props.entity} countProperty="comments:count" />
        ) : null
      }
    />
  );
};

export default observer(CommentsAction);
