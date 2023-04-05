import { computed } from 'mobx';
import { Image } from 'expo-image';
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
    const images: string[] = this.activities
      .filter(activity => activity.hasMedia())
      .map(e => {
        const source = e.getThumbSource('xlarge');
        return source.uri || '';
      })
      .filter(uri => uri);

    if (images) {
      Image.prefetch(images);
    }
    this.imagesPreloaded = true;
  }

  @computed get unseen(): boolean {
    return this.activities.some(a => !a.seen);
  }
}
