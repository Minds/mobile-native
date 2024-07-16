import React from 'react';
import { ViewStyle } from 'react-native';
import { B1 } from '~/common/ui';
import { View } from 'moti';

import { Icon } from '~/common/ui';
import { IconMapNameType } from '~/common/ui/icons/map';
import PressableScale from '~/common/components/PressableScale';
import { ColorsNameType } from '~/styles/Colors';
import sp from '~/services/serviceProvider';
/**
 * Circle icon button
 */
export const IconButtonCircle = ({
  name,
  title,
  color,
  onPress,
  backgroundColor,
}: {
  name: IconMapNameType;
  color?: ColorsNameType;
  title: string;
  onPress: () => void;
  backgroundColor?: ViewStyle['backgroundColor'];
}) => (
  <PressableScale onPress={onPress}>
    <View style={sp.styles.style.alignCenter}>
      <View
        style={
          backgroundColor ? [{ backgroundColor }, styles.circle] : styles.circle
        }>
        <Icon size="medium" name={name} color={color || 'PrimaryText'} />
      </View>
      <B1>{title}</B1>
    </View>
  </PressableScale>
);

export const styles = sp.styles.create({
  circle: [
    {
      width: 55,
      height: 55,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      marginHorizontal: 10,
      borderRadius: 50,
    },
    'bcolorPrimaryBorder',
  ],
});
