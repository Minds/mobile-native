import { computed } from 'mobx';
import FastImage, { Source } from 'react-native-fast-image';
import UserModel from '~/channel/UserModel';
import type ActivityModel from '~/newsfeed/ActivityModel';

export default class PortraitBarItem {
  user: UserModel;
  activities: Array<ActivityModel>;
  imagesPreloaded = false;

  constructor(user: UserModel, activities: Array<ActivityModel>) {
    this.user = user;
    this.activities = activities;
  }

  preloadImages() {
    const images = this.activities
      .map(e => {
        const source = e.hasMedia() ? e.getThumbSource('xlarge') : null;
        if (source) {
          source.priority = FastImage.priority.low;
        }
        return source;
      })
      .filter(s => s !== null && s.uri);

    FastImage.preload(images as Source[]);
    this.imagesPreloaded = true;
  }

  @computed get unseen(): boolean {
    return this.activities.some(a => !a.seen);
  }
}
