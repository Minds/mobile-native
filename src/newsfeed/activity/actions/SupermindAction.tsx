import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { IconButtonNext } from '~/common/ui';
import { actionsContainerStyle } from './styles';

/**
 * Supermind activity action
 */
export default function SupermindAction({ entity }) {
  const navigation = useNavigation();
  const { key } = useRoute();
  return (
    <IconButtonNext
      testID="supermind button"
      style={actionsContainerStyle}
      scale
      name="supermind"
      size="small"
      fill
      onPress={() =>
        navigation.navigate('Compose', {
          isRemind: true,
          entity,
          parentKey: key,
          supermind: true,
        })
      }
    />
  );
}
