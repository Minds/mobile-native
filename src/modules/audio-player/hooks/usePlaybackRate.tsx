import { useEffect, useState } from 'react';
import TrackPlayer from 'react-native-track-player';

export const usePlaybackRate = () => {
  const [rate, setRateVal] = useState<number>(1);

  useEffect(() => {
    refreshRateState();
  }, []);

  const refreshRateState = async () => {
    setRateVal(await TrackPlayer.getRate());
  };

  const setRate = async (rate: number) => {
    await TrackPlayer.setRate(rate);
    setRateVal(rate);
    console.log(rate);
  };

  return { rate, setRate, refreshRateState };
};
