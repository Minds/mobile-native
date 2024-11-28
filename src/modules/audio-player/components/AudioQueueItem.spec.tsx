import { fireEvent, render, waitFor } from '@testing-library/react-native';
import sp from '~/services/serviceProvider';
import TrackPlayer, { Track, useIsPlaying } from 'react-native-track-player';
import { AudioQueueItem } from './AudioQueueItem';
import useIsTrackDownloaded from '../hooks/useIsTrackDownloaded';

jest.mock('~/services/serviceProvider');
sp.mockService('styles');
const audioPlayerMock = sp.mockService('audioPlayer');
sp.mockService('api');
sp.mockService('settings');

jest.mock('../hooks/useIsTrackDownloaded');

const mockTrack: Track = {
  id: '123',
  url: 'https://fake-track',
};

describe('AudioQueueItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render component', () => {
    const comp = render(
      <AudioQueueItem
        trackIndex={0}
        track={mockTrack}
        onRemoveTrack={() => {}}
      />,
    );
    expect(comp).toBeTruthy();
  });

  it('should remove track from the queue', async () => {
    const removedCallbackFn = jest.fn();

    jest.spyOn(TrackPlayer, 'remove');

    const comp = render(
      <AudioQueueItem
        trackIndex={0}
        track={mockTrack}
        onRemoveTrack={removedCallbackFn}
      />,
    );
    const rmvQueueTrackBtn = comp.getByTestId('remove-track');

    fireEvent.press(rmvQueueTrackBtn);

    await waitFor(() => {
      expect(TrackPlayer.remove).toHaveBeenCalledWith(0);
      expect(removedCallbackFn).toHaveBeenCalledWith(mockTrack);
    });
  });

  it('should skip to, and play, track if not already playing', async () => {
    jest.spyOn(TrackPlayer, 'skip');
    jest.spyOn(TrackPlayer, 'play');

    const comp = render(
      <AudioQueueItem
        trackIndex={1}
        track={mockTrack}
        onRemoveTrack={jest.fn()}
      />,
    );
    const playBtn = comp.getByTestId('play-track');

    fireEvent.press(playBtn);

    await waitFor(() => {
      expect(TrackPlayer.skip).toHaveBeenCalledWith(1);
      expect(TrackPlayer.play).toHaveBeenCalled();
    });
  });

  it('should pause track if already playing', async () => {
    jest.spyOn(TrackPlayer, 'skip');
    jest.spyOn(TrackPlayer, 'play');
    jest.spyOn(TrackPlayer, 'pause');

    (TrackPlayer.getActiveTrackIndex as jest.Mock).mockResolvedValue(1);
    (useIsPlaying as jest.Mock).mockReturnValue({ playing: true });

    const comp = render(
      <AudioQueueItem
        trackIndex={1}
        track={mockTrack}
        onRemoveTrack={jest.fn()}
      />,
    );
    const playBtn = comp.getByTestId('play-track');

    await waitFor(() => {});

    fireEvent.press(playBtn);

    await waitFor(() => {
      expect(TrackPlayer.pause).toHaveBeenCalled();
      expect(TrackPlayer.skip).not.toHaveBeenCalled();
      expect(TrackPlayer.play).not.toHaveBeenCalled();
    });
  });

  it('should download a track', async () => {
    jest.spyOn(audioPlayerMock, 'downloadTrack');

    const comp = render(
      <AudioQueueItem
        trackIndex={1}
        track={mockTrack}
        onRemoveTrack={jest.fn()}
      />,
    );
    const downloadBtn = comp.getByTestId('download-track');

    fireEvent.press(downloadBtn);

    await waitFor(() => {
      expect(audioPlayerMock.downloadTrack).toHaveBeenCalledWith(mockTrack);
    });
  });

  it('should delete a downloaded a track', async () => {
    jest.spyOn(audioPlayerMock, 'deleteTrack');

    (useIsTrackDownloaded as jest.Mock).mockReturnValue(true);

    const comp = render(
      <AudioQueueItem
        trackIndex={1}
        track={mockTrack}
        onRemoveTrack={jest.fn()}
      />,
    );
    const downloadBtn = comp.getByTestId('download-track');

    fireEvent.press(downloadBtn);

    await waitFor(() => {
      expect(audioPlayerMock.deleteTrack).toHaveBeenCalledWith(mockTrack);
    });
  });
});
