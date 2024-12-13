import { showNotification } from 'AppMessages';
import TrackPlayer, { Event } from 'react-native-track-player';

module.exports = async function () {
  TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play());
  TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause());
  TrackPlayer.addEventListener('remote-next', () => TrackPlayer.skipToNext());
  TrackPlayer.addEventListener('remote-previous', () =>
    TrackPlayer.skipToPrevious(),
  );
  TrackPlayer.addEventListener(Event.PlaybackError, async e => {
    const progress = await TrackPlayer.getProgress();
    const duration = progress?.duration ?? 0;

    if (!duration) {
      showNotification('Still processing. Try again shortly.', 'warning');
    } else {
      showNotification('Something went wrong.', 'danger');
    }
  });
};
