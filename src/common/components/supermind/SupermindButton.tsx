import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { B2 } from '~/common/ui';
import { SupermindGradient } from '~/styles/Colors';
import ThemedStyles from '~/styles/ThemedStyles';
import UserModel from '../../../channel/UserModel';
import NavigationService from '../../../navigation/NavigationService';

type Props = {
  entity?: UserModel;
};

export default function SupermindButton({ entity }: Props) {
  const handlePress = useCallback(() => {
    NavigationService.navigate('Compose', {
      supermind: true,
      supermindTargetChannel: entity,
      allowedMode: 'video',
    });
  }, [entity]);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={styles.outerStyle}>
      <LinearGradient
        style={styles.gradient}
        colors={SupermindGradient}
        start={start}
        end={end}
        locations={locations}>
        <B2 color="white" font="medium" horizontal="XS">
          Supermind
        </B2>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const start = { x: 0, y: 0 };
const end = { x: 1, y: 0 };
const locations = [0, 0.4, 1];
const styles = ThemedStyles.create({
  outerStyle: [
    {
      height: 36,
      borderRadius: 100,
      overflow: 'hidden',
    },
    'marginLeft2x',
  ],
  gradient: ['flexContainerCenter', 'paddingHorizontal2x'],
});
