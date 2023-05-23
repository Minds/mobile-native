import React, { useCallback } from 'react';
import { IconButtonNext } from '~ui/icons';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import type BlogModel from '../../../blogs/BlogModel';
import { useRoute } from '@react-navigation/native';
import { ActivityRouteProp } from '../../ActivityScreen';
import { actionsContainerStyle } from './styles';
import EntityCounter from './EntityCounter';
import { useGroupContext } from '~/modules/groups/contexts/GroupContext';
import { observer } from 'mobx-react';

type PropsType = {
  entity: ActivityModel | BlogModel;
  testID?: string;
  navigation: any;
  hideCount?: boolean;
  onPressComment?: () => void;
};

/**
 * Comments Action Component
 */
const CommentsAction = (props: PropsType) => {
  const icon = props.entity.allow_comments ? 'chat-solid' : 'chat-off';
  const route: ActivityRouteProp = useRoute();
  const group = useGroupContext()?.group;

  const openComments = useCallback(() => {
    if (props.onPressComment) {
      props.onPressComment();
      return;
    }
    const cantOpen =
      !props.entity.allow_comments && props.entity['comments:count'] === 0;

    if ((route && route.name === 'Activity') || cantOpen) {
      return;
    }
    if (props.entity.subtype && props.entity.subtype === 'blog') {
      props.navigation.push('BlogView', {
        blog: props.entity,
        scrollToBottom: true,
        open: true,
      });
    } else {
      props.navigation.push('Activity', {
        entity: props.entity,
        scrollToBottom: true,
        open: true,
        group: group,
      });
    }
  }, [props, route, group]);

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
      onPress={openComments}
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
