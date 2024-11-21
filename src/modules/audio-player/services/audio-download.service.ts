import TrackPlayer, { Track } from 'react-native-track-player';
import { Storage, Storages } from '~/common/services/storage/storages.service';
import RNFS from 'react-native-fs';
import { showNotification } from 'AppMessages';
import ActivityModel from '~/newsfeed/ActivityModel';
import moment from 'moment';
import { observable } from 'mobx';
import { ApiService } from '~/common/services/api.service';

export type DownloadedTrack = {
  localFilePath: string;
} & Track;

export type DownloadedTrackList = { [key: string]: DownloadedTrack };

export class AudioPlayerDownloadService {
  private userStorage: Storage;

  @observable
  public downloadedTracks: DownloadedTrackList = {};

  constructor(storages: Storages, private apiService: ApiService) {
    this.userStorage = storages.user as Storage;
    this.init();
  }

  public init(): void {
    this.downloadedTracks = this.getDownloadedTracks();
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

    try {
      await download.promise;
      showNotification('Downloaded ' + track.title);
    } catch (err) {
      console.error(err);
      showNotification('Failed to download ' + track.title);
      return; // Do not proceed
    }

    // Save / Update the list of downloaded tracks
    const downloadedTracks = this.getDownloadedTracks();
    downloadedTracks[track.id] = { ...track, localFilePath: filePath };
    this.userStorage.setObject('audio-downloaded-tracks', downloadedTracks);
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
    this.userStorage.setObject('audio-downloaded-tracks', downloadedTracks);
    this.downloadedTracks = downloadedTracks;
  }

  public async isTrackDownloaded(track: Track): Promise<boolean> {
    return RNFS.exists(this.getFilePath(track.id));
  }

  /**
   * A key value object of all the downloaded tracks
   */
  public getDownloadedTracks(): DownloadedTrackList {
    return this.userStorage.getObject('audio-downloaded-tracks') || {};
  }

  /**
   * Returns the filepath of based on an id
   */
  private getFilePath(id: string): string {
    return `${RNFS.CachesDirectoryPath}/${id}.mp3`;
  }
}

export default AudioPlayerDownloadService;
