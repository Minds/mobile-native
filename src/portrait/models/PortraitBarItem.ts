import { computed } from 'mobx';
import TurboImage from 'react-native-turbo-image';
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
    const images: Array<{ uri: string }> = this.activities
      .filter(activity => activity.hasMedia())
      .map(e => {
        const source = e.getThumbSource('xlarge');
        return source;
      })
      .filter(uri => uri);

    if (images) {
      TurboImage.prefetch(images);
    }
    this.imagesPreloaded = true;
  }

  @computed get unseen(): boolean {
    return this.activities.some(a => !a.seen);
  }
}
