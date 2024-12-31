import { fireEvent, render, waitFor } from '@testing-library/react-native';
import sp from '~/services/serviceProvider';
import TrackPlayer, { Track, useIsPlaying } from 'react-native-track-player';
import { AudioQueueItem } from './AudioQueueItem';
import useIsTrackDownloaded from '../hooks/useIsTrackDownloaded';
import { PlaybackSpeedPicker } from './PlaybackSpeedPicker';

jest.mock('~/services/serviceProvider');
sp.mockService('styles');

sp.mockService('api');
sp.mockService('settings');

jest.mock('../hooks/useIsTrackDownloaded');

describe('PlaybackSpeedPicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render component', () => {
    const comp = render(<PlaybackSpeedPicker onSelected={() => {}} />);
    expect(comp).toBeTruthy();
  });
});
