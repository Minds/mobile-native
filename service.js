import TrackPlayer, { Event } from 'react-native-track-player';
import sp from '~/services/serviceProvider';

module.exports = async function () {
  TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play());
  TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause());
  TrackPlayer.addEventListener('remote-next', () => TrackPlayer.skipToNext());
  TrackPlayer.addEventListener('remote-previous', () =>
    TrackPlayer.skipToPrevious(),
  );
  TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, e => {
    sp.resolve('audioPlayer').setTrackProgress(e.track, e.position);
  });
};
