import React from 'react';
import { IconButtonNext } from '~/common/ui';
import { actionsContainerStyle } from './styles';

/**
 * Supermind activity action
 */
export default function SupermindAction({ entity }) {
  return (
    <IconButtonNext
      testID="supermind button"
      style={actionsContainerStyle}
      scale
      name="supermind"
      size="small"
      fill
      active={Boolean(entity.supermind)}
      onPress={() => {
        if (!entity.supermind) {
          console.log('Call the composer here');
        }
      }}
    />
  );
}
