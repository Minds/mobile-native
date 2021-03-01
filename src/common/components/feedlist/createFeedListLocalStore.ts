const createFeedListLocalStore = () => ({
  itemHeight: 0,
  viewed: [],
  viewOpts: {
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300,
  },
  /**
   * Adjust tiles to 1/cols size
   */
  onLayout(e: { nativeEvent: { layout: { width: any } } }) {
    const width = e.nativeEvent.layout.width;
    this.itemHeight = width / 3;
  },
});

export type FeedListStore = ReturnType<typeof createFeedListLocalStore>;
export default createFeedListLocalStore;
