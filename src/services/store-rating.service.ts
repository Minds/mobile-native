import moment from 'moment';
import { InteractionManager } from 'react-native';
import * as StoreReview from 'expo-store-review';
import { storages } from '../common/services/storage/storages.service';
import { USAGE_SCORES, RATING_APP_SCORE_THRESHOLD } from '../config/Config';

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
      moment().isBefore(moment(this.lastPromptedAt).add({ days: 30 }))
    ) {
      return false;
    }

    return this.points > RATING_APP_SCORE_THRESHOLD;
  }

  async prompt() {
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
