import { render } from '@testing-library/react-native';
import { usePlaybackInfo } from '@livepeer/react-native/hooks';
import { StreamPlayer } from './StreamPlayer';
import useRecordedVideo from './hooks/useRecordedVideo';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');
// mock services
sp.mockService('styles');

jest.mock('@livepeer/react-native/hooks');
jest.mock('@livepeer/react-native', () => ({
  Player: () => 'MockedPlayer',
}));
jest.mock('./hooks/useRecordedVideo');
jest.mock('@expo/vector-icons/Foundation');

const mockedUsePlaybackInfo = usePlaybackInfo as jest.Mock;
const mockedUseRecordedVideo = useRecordedVideo as jest.Mock;

describe('StreamPlayer', () => {
  it('renders a 16:9 box when there is no data', () => {
    mockedUsePlaybackInfo.mockReturnValue({ data: null });

    const { getByTestId } = render(
      <StreamPlayer id="asdasd" testID="test-id" enabled={true} />,
    );

    expect(getByTestId('box16to9')).not.toBeNull();
  });

  it('renders StreamOffline when the stream is not live', () => {
    mockedUsePlaybackInfo.mockReturnValue({
      data: {
        type: 'live',
        meta: {
          live: false,
        },
      },
    });

    mockedUseRecordedVideo.mockReturnValue({ data: { status: 'pending' } });

    const { getByTestId } = render(
      <StreamPlayer id="asdasd" testID="test-id" enabled={true} />,
    );

    expect(getByTestId('offlineMessage')).not.toBeNull();
  });

  it('renders RecordPlayer when the stream is live', () => {
    mockedUsePlaybackInfo.mockReturnValue({
      data: {
        type: 'live',
        meta: {
          live: true,
          source: [{ url: 'test-url' }],
        },
      },
    });

    const { getByTestId } = render(
      <StreamPlayer id="asdasd" testID="record-player" enabled={true} />,
    );

    expect(getByTestId('record-player')).not.toBeNull();
  });
});
