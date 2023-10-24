import React from 'react';
import { observer } from 'mobx-react';

import { StreamPlayer, StreamPlayerProps } from './StreamPlayer';
import type ActivityModel from '~/newsfeed/ActivityModel';
import { useIsFocused } from '@react-navigation/native';

type FeedStreamPlayerProps = StreamPlayerProps & {
  entity: ActivityModel;
};

function FeedPlayer({ entity, ...other }: FeedStreamPlayerProps) {
  const isFocused = useIsFocused();
  // pause when not visible or screen lose focus
  return <StreamPlayer enabled={entity.is_visible && isFocused} {...other} />;
}
export const FeedStreamPlayer = observer(FeedPlayer);
