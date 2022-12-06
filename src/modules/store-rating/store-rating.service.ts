import * as StoreReview from 'expo-store-review';
import moment from 'moment';
import { InteractionManager, Linking } from 'react-native';
import openUrlService from '../../common/services/open-url.service';
import { storages } from '../../common/services/storage/storages.service';
import {
  RATING_APP_SCORE_THRESHOLD,
  STORE_LINK,
  USAGE_SCORES,
} from '../../config/Config';
import { rateApp } from './components/RateApp';

const SCORES_KEY = 'APP_SCORES';
const LAST_PROMPTED_AT_KEY = 'STORE_RATING_LAST_PROMPTED_AT';

class StoreRatingService {
  lastPromptedAt: number | null =
    storages.app.getInt(LAST_PROMPTED_AT_KEY) || null;
  points = storages.app.getInt(SCORES_KEY) || 0;

  track(key: keyof typeof USAGE_SCORES, prompt = false) {
    this.points += USAGE_SCORES[key];

    if (prompt && this.shouldPrompt) {
      return setTimeout(() => {
        InteractionManager.runAfterInteractions(() => {
          this.prompt();
        });
      }, 500);
    }

    storages.app.setIntAsync(SCORES_KEY, this.points);
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
    Linking.openURL(STORE_LINK);
  }

  async openFeedbackForm() {
    openUrlService.openLinkInInAppBrowser(
      'https://mindsdotcom.typeform.com/app-feedback',
    );
  }

  async prompt() {
    if (await rateApp()) {
      this.redirectToStore();
    } else {
      this.openFeedbackForm();
    }
    this.lastPromptedAt = Date.now();
    storages.app.setIntAsync(LAST_PROMPTED_AT_KEY, this.lastPromptedAt);
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
}

const storeRatingService = new StoreRatingService();

export default storeRatingService;
