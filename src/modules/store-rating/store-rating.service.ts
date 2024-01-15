import * as StoreReview from 'expo-store-review';
import debounce from 'lodash/debounce';
import moment from 'moment';
import { InteractionManager, Linking } from 'react-native';
import openUrlService from '../../common/services/open-url.service';
import { storages } from '../../common/services/storage/storages.service';
import {
  IS_TENANT,
  RATING_APP_SCORE_THRESHOLD,
  STORE_REVIEW_LINK,
  USAGE_SCORES,
} from '../../config/Config';
import { rateApp } from './components/RateApp';

const SCORES_KEY = 'APP_SCORES';
const LAST_PROMPTED_AT_KEY = 'STORE_RATING_LAST_PROMPTED_AT';

class StoreRatingService {
  lastPromptedAt: number | null =
    storages.app.getInt(LAST_PROMPTED_AT_KEY) || null;
  points = storages.app.getInt(SCORES_KEY) || 0;

  constructor() {
    this.debouncedSetStorage = debounce(this.debouncedSetStorage, 2000);
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
    openUrlService.openLinkInInAppBrowser(
      'https://mindsdotcom.typeform.com/app-feedback',
    );
  }

  async prompt() {
    const rated = await rateApp();
    this.lastPromptedAt = Date.now();
    storages.app.setIntAsync(LAST_PROMPTED_AT_KEY, this.lastPromptedAt);

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
    storages.app.setIntAsync(LAST_PROMPTED_AT_KEY, this.lastPromptedAt);
  }

  debouncedSetStorage(key: string, value: any) {
    storages.app.setIntAsync(key, value);
  }
}

const storeRatingService = new StoreRatingService();

export default storeRatingService;
