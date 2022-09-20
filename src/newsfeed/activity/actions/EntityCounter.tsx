import React from 'react';
import { observer } from 'mobx-react';
import Counter, { CounterPropsType } from './Counter';
import type BaseModel from '~/common/BaseModel';

type PropsType = Omit<CounterPropsType, 'count'> & {
  entity: BaseModel;
  countProperty: string;
};

/**
 * Observer entity counter
 */
function EntityCounter({ entity, countProperty, ...other }: PropsType) {
  return (
    <Counter
      {...other}
      count={entity[countProperty]}
      spaced={true}
      animated={false}
    />
  );
}

export default observer(EntityCounter);
