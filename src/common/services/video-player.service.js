/**
 * Video Player Service
 */
class VideoPlayerService {
  /**
   * current playing video player reference
   */
  current = null;

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

  /**
   * Clear the current player ref
   */
  clear() {
    this.current = null;
  }
}

export default new VideoPlayerService();
