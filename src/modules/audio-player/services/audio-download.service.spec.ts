import sp from '~/services/__mocks__/serviceProvider';
import AudioPlayerDownloadService from './audio-download.service';
import ActivityModel from '~/newsfeed/ActivityModel';
import RNFS from 'react-native-fs';
import TrackPlayer from 'react-native-track-player';

const storageMock = sp.mockService('storages');
const apiMock = sp.mockService('api');
sp.mockService('analytics');

describe('AudioPlayerDownloadService', () => {
  let service: AudioPlayerDownloadService;

  beforeEach(() => {
    jest.resetAllMocks();
    const serviceClass = jest.requireActual(
      '~/modules/audio-player/services/audio-download.service',
    ).default;
    service = new serviceClass(storageMock, apiMock);
  });

  it('should construct', () => {
    expect(service).toBeInstanceOf(
      jest.requireActual(
        '~/modules/audio-player/services/audio-download.service',
      ).default,
    );
  });

  it('should build remote track from an entity', () => {
    const entity = {
      guid: '123',
      title: 'Title',
      ownerObj: {
        name: 'Test name',
      } as any,
      custom_data: {
        src: 'fake-url',
        thumbnail_src: 'fake-thumb-url',
        duration_secs: 12.5,
      },
      time_created: '1732195733',
    } as ActivityModel;

    const track = service.buildRemoteTrack(entity);

    expect(track.id).toBe('123');
    expect(track.title).toBe('Title');
    expect(track.artist).toBe('Test name');
    expect(track.url).toBe('fake-url');
    expect(track.artwork).toBe('fake-thumb-url');
    expect(track.duration).toBe(12.5);
    expect(track.date).toBe('2024-11-21T13:28:53.000Z');
  });

  it('should build local track from an entity', async () => {
    (RNFS.exists as jest.Mock).mockResolvedValue(true);
    (RNFS.DocumentDirectoryPath as string) = '/tmp';

    const entity = {
      guid: '123',
      title: 'Title',
      ownerObj: {
        name: 'Test name',
      } as any,
      custom_data: {
        src: 'fake-url',
        thumbnail_src: 'fake-thumb-url',
        duration_secs: 12.5,
      },
      time_created: '1732195733',
    } as ActivityModel;

    const track = await service.buildHybridTrack(entity);

    expect(track.url).toBe('/tmp/123.mp3');
  });

  it('should download the track', async () => {
    const track = {
      id: '123',
      url: 'https://fake-url',
    };

    (RNFS.downloadFile as jest.Mock).mockReturnValue({
      promise: jest.fn(),
    });
    (RNFS.CachesDirectoryPath as string) = '/tmp';

    (TrackPlayer.getQueue as jest.Mock).mockResolvedValue([track]);

    await service.downloadTrack(track);

    expect(RNFS.downloadFile).toHaveBeenCalledWith({
      fromUrl: 'https://fake-url',
      toFile: '/tmp/123.mp3',
      progressDivider: 1,
    });

    // Storage is updated
    expect(storageMock.user.setObject).toHaveBeenCalledWith(
      'audio-downloaded-tracks-v2',
      {
        '123': {
          id: '123',
          localFilePath: '/tmp/123.mp3',
          url: 'https://fake-url',
        },
      },
    );

    // Queue is updated
    expect(TrackPlayer.setQueue).toHaveBeenCalledWith([
      { ...track, url: '/tmp/123.mp3' },
    ]);
  });

  it('should delete a track', async () => {
    const track = {
      id: '123',
      url: 'https://fake-url',
    };

    (RNFS.unlink as jest.Mock).mockResolvedValue(true);
    (RNFS.CachesDirectoryPath as string) = '/tmp';

    (TrackPlayer.getQueue as jest.Mock).mockResolvedValue([track]);

    (storageMock.user.getObject as jest.Mock).mockReturnValue({
      '123': { ...track, localFilePath: '/tmp/123.mp3' },
    });
    await service.deleteTrack(track);

    expect(RNFS.unlink).toHaveBeenCalledWith('/tmp/123.mp3');
    expect(storageMock.user.setObject).toHaveBeenCalledWith(
      'audio-downloaded-tracks-v2',
      {},
    );

    // Queue is updated
    expect(TrackPlayer.setQueue).toHaveBeenCalledWith([
      { ...track, url: 'https://fake-url', localFilePath: '/tmp/123.mp3' },
    ]);
  });
});
