/**
 * Video Player Service
 */
class VideoPlayerService {
  /**
   * current playing video player reference
   */
  current: { pause: () => void } | null = null;

  /**
   * current initial volume
   */
  currentVolume = 0;

  /**
   * Set current player reference
   * @param {MindsVideo} videoPlayerRef
   */
  setCurrent(videoPlayerRef) {
    if (this.current && this.current !== videoPlayerRef) {
      this.current.pause();
    }
    this.current = videoPlayerRef;
  }

  setVolume(value: number) {
    this.currentVolume = value;
  }

  /**
   * Clear the current player ref
   */
  clear() {
    this.current = null;
  }
}

export default new VideoPlayerService();
