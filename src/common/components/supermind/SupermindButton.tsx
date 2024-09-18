import React, { useCallback } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import UserModel from '../../../channel/UserModel';
import GradientButton from '../GradientButton';
import sp from '~/services/serviceProvider';

type Props = {
  entity?: UserModel;
  style?: StyleProp<ViewStyle>;
};

export default function SupermindButton({ entity, style }: Props) {
  const handlePress = useCallback(() => {
    sp.navigation.navigate('Compose', {
      openSupermindModal: true,
      supermindTargetChannel: entity,
      allowedMode: 'video',
    });
  }, [entity]);

  return (
    <GradientButton onPress={handlePress} title="Supermind" style={style} />
  );
}
