import TrackPlayer, { Event, State, Track } from 'react-native-track-player';
import { Storage, Storages } from '~/common/services/storage/storages.service';
import RNFS from 'react-native-fs';
import { showNotification } from 'AppMessages';
import ActivityModel from '~/newsfeed/ActivityModel';
import moment from 'moment';
import { observable } from 'mobx';
import { ApiService } from '~/common/services/api.service';
import { AnalyticsService } from '~/common/services/analytics.service';

export type DownloadedTrack = {
  localFilePath: string;
} & Track;

export type DownloadedTrackList = { [key: string]: DownloadedTrack };

export type TrackProgress = {
  progress: number;
  lastPlayedAt: Date;
};

export type TrackProgressList = { [key: string]: TrackProgress };

const AUDIO_TRACK_PROGRESS_STORAGE_KEY = 'audio-track-progress';
const AUDIO_DOWNLOADED_TRACKS_STORAGE_KEY = 'audio-downloaded-tracks';

export class AudioPlayerDownloadService {
  private userStorage: Storage;

  @observable
  public downloadedTracks: DownloadedTrackList = {};

  @observable
  public trackProgressList: TrackProgressList = {};

  constructor(
    storages: Storages,
    private apiService: ApiService,
    private analyticService: AnalyticsService,
  ) {
    this.userStorage = storages.user as Storage;
    this.init();
  }

  public init(): void {
    this.downloadedTracks = this.getDownloadedTracks();
    this.trackProgressList = this.getTrackProgressList();

    TrackPlayer.addEventListener(Event.PlaybackState, e => {
      let eventName: string;
      switch (e.state) {
        case State.Playing:
          eventName = 'audio_play';
          break;
        case State.Paused:
          eventName = 'audio_pause';
          break;
        default:
          return;
      }

      (async () => {
        const activeTrack = await TrackPlayer.getActiveTrack();
        this.analyticService.posthog.capture(eventName, {
          entity_guid: activeTrack?.id,
        });
      })();
    });
  }

  /**
   * Builds a Track object
   */
  public buildRemoteTrack(entity: ActivityModel): Track {
    const headers = this.apiService.buildHeaders();

    return {
      id: entity.guid,
      title: entity.title,
      artist: entity.ownerObj.name,
      url: entity.custom_data.src,
      artwork: entity.custom_data.thumbnail_src,
      duration: entity.custom_data.duration_secs,
      date: moment(parseInt(entity.time_created) * 1000).toISOString(),
      headers: headers,
    };
  }

  /**
   * Builds a Track object, using the offline file if available
   */
  public async buildHybridTrack(entity: ActivityModel): Promise<Track> {
    const track = this.buildRemoteTrack(entity);

    // If downloaded, replace with the local filepath
    if (await this.isTrackDownloaded(track)) {
      track.url = this.getFilePath(track.id);
    }

    return track;
  }

  /**
   * Downloads the track
   */
  public async downloadTrack(track: Track) {
    // Download the audio file to local file system

    showNotification('Downloading ' + track.title);

    const filePath = this.getFilePath(track.id);

    const download = RNFS.downloadFile({
      fromUrl: track.url,
      toFile: filePath,
      progressDivider: 1,
      headers: this.apiService.buildHeaders(),
    });

    if (!this.isTrackDownloaded(track)) {
      // Sometims the file is there and the datastore has just forgot about it
      try {
        await download.promise;
        showNotification('Downloaded ' + track.title);
      } catch (err) {
        console.error(err);
        showNotification('Failed to download ' + track.title);
        return; // Do not proceed
      }
    }

    // Save / Update the list of downloaded tracks
    const downloadedTracks = this.getDownloadedTracks();
    downloadedTracks[track.id] = { ...track, localFilePath: filePath };
    this.userStorage.setObject(
      AUDIO_DOWNLOADED_TRACKS_STORAGE_KEY,
      downloadedTracks,
    );
    this.downloadedTracks = downloadedTracks;

    // Update the url of the track
    track.url = filePath;

    // Patch the queue
    const queue = (await TrackPlayer.getQueue()).slice();

    for (let i in queue) {
      const queuedTrack = queue[i];
      if (queuedTrack.id === track.id) {
        queue[i] = track;
      }
    }
    await TrackPlayer.setQueue(queue);

    // Reset the progress time
    this.resetActiveTrackProgress();
  }

  /**
   * Deletes the downloaded track
   */
  public async deleteTrack(track: Track): Promise<void> {
    // Get a list of downloaded tracks
    const downloadedTracks = this.getDownloadedTracks();

    // Fix the url the remote one again
    track = downloadedTracks[track.id];

    // Patch the queue
    const queue = await TrackPlayer.getQueue();

    for (let i in queue) {
      const queuedTrack = queue[i];
      if (queuedTrack.id === track.id) {
        queue[i] = track;
      }
    }

    await TrackPlayer.setQueue(queue);

    // Reset the progress time
    this.resetActiveTrackProgress();

    try {
      // Remove the file
      await RNFS.unlink(this.getFilePath(track.id));
    } catch (err) {
      if (err === 'File does not exist') {
      }
      //console.error(err);
    }

    // Remove from the list of downloaded tracks
    delete downloadedTracks[track.id];
    this.userStorage.setObject(
      AUDIO_DOWNLOADED_TRACKS_STORAGE_KEY,
      downloadedTracks,
    );
    this.downloadedTracks = downloadedTracks;
  }

  /**
   * Reset the player to the last known progress that the active track had
   */
  private async resetActiveTrackProgress(): Promise<void> {
    const activeTrack = await TrackPlayer.getActiveTrack();
    await TrackPlayer.seekTo(this.getTrackProgress(activeTrack?.id));
  }

  public async isTrackDownloaded(track: Track): Promise<boolean> {
    return RNFS.exists(this.getFilePath(track.id));
  }

  /**
   * Returns any saved progress of the track
   */
  public getTrackProgress(trackId: string): number {
    return this.trackProgressList[trackId]?.progress || 0;
  }

  /**
   * Saves a tracks position to device storage
   */
  public async setTrackProgress(
    trackNumber: number,
    position: number,
  ): Promise<void> {
    const track = await TrackPlayer.getTrack(trackNumber);

    this.trackProgressList[track?.id] = {
      progress: position,
      lastPlayedAt: new Date(),
    };

    this.userStorage.setObject(
      AUDIO_TRACK_PROGRESS_STORAGE_KEY,
      this.trackProgressList,
    );
  }

  /**
   * A key value object of all the downloaded tracks
   */
  public getDownloadedTracks(): DownloadedTrackList {
    return (
      this.userStorage.getObject(AUDIO_DOWNLOADED_TRACKS_STORAGE_KEY) || {}
    );
  }

  /**
   * A key value object of all the tracks that have been played  on the device
   */
  public getTrackProgressList(): TrackProgressList {
    return this.userStorage.getObject(AUDIO_TRACK_PROGRESS_STORAGE_KEY) || {};
  }

  /**
   * Returns the filepath of based on an id
   */
  private getFilePath(id: string): string {
    return `${RNFS.DocumentDirectoryPath}/${id}.mp3`;
  }
}

export default AudioPlayerDownloadService;
