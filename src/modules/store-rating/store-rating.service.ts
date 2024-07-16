import * as StoreReview from 'expo-store-review';
import debounce from 'lodash/debounce';
import moment from 'moment';
import { InteractionManager, Linking } from 'react-native';
import {
  IS_TENANT,
  RATING_APP_SCORE_THRESHOLD,
  STORE_REVIEW_LINK,
  USAGE_SCORES,
} from '../../config/Config';
import { rateApp } from './components/RateApp';
import type { Storages } from '~/common/services/storage/storages.service';
import type { OpenURLService } from '~/common/services/open-url.service';
import { openLinkInInAppBrowser } from '~/common/services/inapp-browser.service';

const SCORES_KEY = 'APP_SCORES';
const LAST_PROMPTED_AT_KEY = 'STORE_RATING_LAST_PROMPTED_AT';

export class StoreRatingService {
  lastPromptedAt: number | null;
  points: number;

  constructor(private storages: Storages, private openURL: OpenURLService) {
    this.debouncedSetStorage = debounce(this.debouncedSetStorage, 2000);
    this.lastPromptedAt = storages.app.getNumber(LAST_PROMPTED_AT_KEY) || null;
    this.points = storages.app.getNumber(SCORES_KEY) || 0;
  }

  track(key: keyof typeof USAGE_SCORES, prompt = false) {
    // Do not track or prompt on tenant apps
    if (IS_TENANT) {
      return;
    }

    const pointsOld = this.points;

    this.points += USAGE_SCORES[key];

    if (prompt && this.shouldPrompt) {
      return setTimeout(() => {
        InteractionManager.runAfterInteractions(() => {
          this.prompt();
        });
      }, 500);
    }

    // do not save if the threshold was reached already (optimization)
    if (pointsOld > RATING_APP_SCORE_THRESHOLD) {
      return;
    }

    this.debouncedSetStorage(SCORES_KEY, this.points);
  }

  get shouldPrompt() {
    if (
      this.lastPromptedAt &&
      moment().isBefore(moment(this.lastPromptedAt).add({ days: 120 }))
    ) {
      return false;
    }

    return this.points > RATING_APP_SCORE_THRESHOLD;
  }

  async redirectToStore() {
    Linking.openURL(STORE_REVIEW_LINK);
  }

  async openFeedbackForm() {
    openLinkInInAppBrowser('https://mindsdotcom.typeform.com/app-feedback');
  }

  async prompt() {
    const rated = await rateApp();
    this.lastPromptedAt = Date.now();
    this.storages.app.set(LAST_PROMPTED_AT_KEY, this.lastPromptedAt);

    if (rated === null) {
      return null;
    }

    if (rated) {
      this.redirectToStore();
    } else if (rated === false) {
      this.openFeedbackForm();
    }
  }

  async promptNatively() {
    if (!(await StoreReview.hasAction())) {
      return false;
    }

    if (!(await StoreReview.isAvailableAsync())) {
      return false;
    }

    await StoreReview.requestReview();
    this.lastPromptedAt = Date.now();
    this.storages.app.set(LAST_PROMPTED_AT_KEY, this.lastPromptedAt);
  }

  debouncedSetStorage(key: string, value: any) {
    this.storages.app.set(key, value);
  }
}
