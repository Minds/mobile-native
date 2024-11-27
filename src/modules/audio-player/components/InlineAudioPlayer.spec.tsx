import { fireEvent, render, waitFor } from '@testing-library/react-native';
import InlineAudioPlayer from './InlineAudioPlayer';
import ActivityModel from '~/newsfeed/ActivityModel';
import sp from '~/services/serviceProvider';
import TrackPlayer, {
  useActiveTrack,
  useIsPlaying,
} from 'react-native-track-player';

jest.mock('~/services/serviceProvider');
sp.mockService('styles');
const audioPlayerMock = sp.mockService('audioPlayer');
sp.mockService('api');
sp.mockService('settings');

const mockActivity = {
  guid: '123',
  title: 'Audio title',
  ownerObj: {
    name: 'Tester',
  },
  custom_data: {
    thumbnail_src: 'https://fake-url',
    duration_secs: 12.5,
  },
} as ActivityModel;

describe('InlineAudioPlayer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render component', () => {
    const comp = render(<InlineAudioPlayer entity={mockActivity} />);
    expect(comp).toBeTruthy();
  });

  it('should queue a track', async () => {
    jest.spyOn(TrackPlayer, 'add');

    const trackToQueue = {
      url: 'https://fake-url',
    };

    audioPlayerMock.buildHybridTrack.mockResolvedValue(trackToQueue);

    const comp = render(<InlineAudioPlayer entity={mockActivity} />);
    const queueTrackBtn = comp.getByTestId('queue-track');

    fireEvent.press(queueTrackBtn);

    await waitFor(() =>
      expect(TrackPlayer.add).toHaveBeenCalledWith(trackToQueue),
    );
  });

  it('should play track', async () => {
    (useActiveTrack as jest.Mock).mockReturnValue(
      {} as ReturnType<typeof useActiveTrack>,
    );

    jest.spyOn(TrackPlayer, 'load');
    jest.spyOn(TrackPlayer, 'play');

    const trackToQueue = {
      url: 'https://fake-url',
    };

    audioPlayerMock.buildHybridTrack.mockResolvedValue(trackToQueue);

    const comp = render(<InlineAudioPlayer entity={mockActivity} />);
    const playTrackBtn = comp.getByTestId('play-track');

    fireEvent.press(playTrackBtn);

    await waitFor(() =>
      expect(TrackPlayer.load).toHaveBeenCalledWith(trackToQueue),
    );
    await waitFor(() => expect(TrackPlayer.play).toHaveBeenCalled());
  });

  it('should not load a track if active track is the same', async () => {
    jest.spyOn(TrackPlayer, 'load');
    jest.spyOn(TrackPlayer, 'play');

    const trackToQueue = {
      id: '123', // same as entity
      url: 'https://fake-url',
    };

    (useActiveTrack as jest.Mock).mockReturnValue(
      trackToQueue as ReturnType<typeof useActiveTrack>,
    );

    audioPlayerMock.buildHybridTrack.mockResolvedValue(trackToQueue);

    const comp = render(<InlineAudioPlayer entity={mockActivity} />);
    const playTrackBtn = comp.getByTestId('play-track');

    fireEvent.press(playTrackBtn);

    await waitFor(() => expect(TrackPlayer.load).not.toHaveBeenCalled());
    await waitFor(() => expect(TrackPlayer.play).toHaveBeenCalled());
  });

  it('should pause the track if active track matches', async () => {
    jest.spyOn(TrackPlayer, 'pause');
    jest.spyOn(TrackPlayer, 'play');

    const trackToQueue = {
      id: '123', // same as entity
      url: 'https://fake-url',
    };

    (useActiveTrack as jest.Mock).mockReturnValue(
      trackToQueue as ReturnType<typeof useActiveTrack>,
    );
    (useIsPlaying as jest.Mock).mockReturnValue({ playing: true });

    audioPlayerMock.buildHybridTrack.mockResolvedValue(trackToQueue);

    const comp = render(<InlineAudioPlayer entity={mockActivity} />);
    const playTrackBtn = comp.getByTestId('play-track');

    fireEvent.press(playTrackBtn);

    await waitFor(() => expect(TrackPlayer.pause).toHaveBeenCalled());
    await waitFor(() => expect(TrackPlayer.play).not.toHaveBeenCalled());
  });
});
