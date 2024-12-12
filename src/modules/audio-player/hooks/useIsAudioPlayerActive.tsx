import { useEffect, useState } from 'react';
import { useActiveTrack, usePlaybackState } from 'react-native-track-player';

export const useIsAudioPlayerActive = () => {
  const [active, setActive] = useState<boolean>();

  const playBackState = usePlaybackState();
  const activeTrack = useActiveTrack();

  useEffect(() => {
    setActive(!!activeTrack && playBackState !== undefined);
  }, [playBackState, activeTrack]);

  return active;
};
