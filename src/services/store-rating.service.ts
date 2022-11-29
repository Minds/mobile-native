import { InteractionManager } from 'react-native';
import * as StoreReview from 'react-native-store-review';
import { storages } from '../common/services/storage/storages.service';
import { USAGE_SCORES, RATING_APP_SCORE_THRESHOLD } from '../config/Config';

const SCORES_KEY = 'APP_SCORES';

class StoreRatingService {
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
    return this.points > RATING_APP_SCORE_THRESHOLD;
  }

  prompt() {
    StoreReview.requestReview();
  }
}

const storeRatingService = new StoreRatingService();

export default storeRatingService;
