import { render, waitFor } from '@testing-library/react-native';
import sp from '~/services/serviceProvider';
import { FullscreenAudioPlayer } from './FullscreenAudioPlayer';
import TrackPlayer from 'react-native-track-player';

jest.mock('~/services/serviceProvider');
sp.mockService('styles');

jest.mock('./GlobalAudioPlayer');
jest.mock('../hooks/useGetDownloadedList', () => jest.fn(() => ({ list: [] })));

describe('FullscreenAudioPlayer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render component', async () => {
    (TrackPlayer.getQueue as jest.Mock).mockResolvedValue([]);

    const comp = render(<FullscreenAudioPlayer />);

    expect(comp).toBeTruthy();
    await waitFor(() => expect(TrackPlayer.getQueue).toHaveBeenCalled());
  });
});
