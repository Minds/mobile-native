import { Pressable } from 'react-native';
import { Player } from '@livepeer/react-native';

/**
 * Livepeer live record player
 */
export const RecordPlayer = ({
  src,
  enabled = true,
  testID,
}: {
  src: string;
  enabled?: boolean;
  testID?: string;
}) => {
  // Wrapped in a pressable in order to avoid navigating to the post when the user taps on the video player
  return (
    <Pressable testID={testID}>
      <Player
        src={src}
        muted={true}
        aspectRatio="16to9"
        _isCurrentlyShown={enabled}
        autoPlay={true}
      />
    </Pressable>
  );
};
