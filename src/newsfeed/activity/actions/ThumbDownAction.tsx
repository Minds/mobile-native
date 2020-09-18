import React from 'react';
import { observer } from 'mobx-react';
import ActivityModel from '../../ActivityModel';
import ThumbUpAction from './ThumbUpAction';

type PropsType = {
  entity: ActivityModel;
  size?: number;
  orientation?: 'column' | 'row';
};

const ThumbDownAction = observer((props: PropsType) => {
  return (
    <ThumbUpAction
      direction="down"
      iconName="thumb-down"
      voted={props.entity.votedDown}
      {...props}
    />
  );
});

export default ThumbDownAction;
