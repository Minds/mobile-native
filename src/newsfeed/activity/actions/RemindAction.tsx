import React, { useCallback } from 'react';

import { TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { CommonStyle as CS } from '../../../styles/Common';
import Counter from './Counter';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import { FLAG_REMIND } from '../../../common/Permissions';
import { useRoute, useNavigation } from '@react-navigation/native';
import ThemedStyles from '../../../styles/ThemedStyles';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import type BlogModel from '../../../blogs/BlogModel';

// prevent double tap in touchable
const TouchableOpacityCustom = withPreventDoubleTap(TouchableOpacity);

type PropsTypes = {
  entity: ActivityModel | BlogModel;
  size?: number;
  vertical?: boolean;
};

/**
 * Remind Action Component
 */
export default function ({ entity, size = 21, vertical = false }: PropsTypes) {
  const color = entity.can(FLAG_REMIND)
    ? ThemedStyles.style.colorIcon
    : CS.colorLightGreyed;

  const route = useRoute();
  const navigation = useNavigation<any>();

  /**
   * Open remind
   */
  const remind = useCallback(() => {
    // check permission and show alert
    if (!entity.can(FLAG_REMIND, true)) {
      return;
    }

    const { key } = route;

    navigation.navigate('Capture', { isRemind: true, entity, parentKey: key });
  }, [route, entity, navigation]);

  return (
    <TouchableOpacityCustom
      style={[
        ThemedStyles.style.rowJustifyCenter,
        ThemedStyles.style.paddingHorizontal3x,
        ThemedStyles.style.paddingVertical4x,
        ThemedStyles.style.alignCenter,
      ]}
      onPress={remind}
      testID="Remind activity button">
      <Icon style={[color, CS.marginRight]} name="repeat" size={size} />
      <Counter count={entity.reminds} />
    </TouchableOpacityCustom>
  );
}
