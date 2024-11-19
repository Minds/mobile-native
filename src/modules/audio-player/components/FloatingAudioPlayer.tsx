import { View } from 'react-native';
import GlobalAudioPlayer from './GlobalAudioPlayer';
import sp from '~/services/serviceProvider';
import { useIsAudioPlayerActive } from '../hooks/useIsAudioPlayerActive';

export type FloatingAudioPlayer = {};

export default function FloatingAudioPlayer(props: FloatingAudioPlayer) {
  const isActive = useIsAudioPlayerActive();

  return isActive ? (
    <View
      style={[
        sp.styles.style.paddingHorizontal4x,
        sp.styles.style.paddingTop2x,
        sp.styles.style.borderTop,
        { borderColor: sp.styles.getColor('PrimaryBorder') },
      ]}>
      <GlobalAudioPlayer />
    </View>
  ) : undefined;
}
