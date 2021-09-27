import { GrowthBook, Experiment } from '@growthbook/growthbook';
import analytics from './analytics.service';

/**
 * Experiments service
 */
export class ExperimentsService {
  growthbook?: GrowthBook;
  experiments: Array<
    Experiment<unknown> & { running: boolean; force: number }
  > = [];

  /**
   * Initialize Growthbook
   */
  initGrowthbook(user, experiments): void {
    // we clear the contexts
    analytics.clearContexts();

    this.growthbook = new GrowthBook({
      url: '',
      user: { id: user.guid },
      trackingCallback: (experiment, result) => {
        /**
         * Tracking is only called if force is not used
         */
        analytics.addExperimentContext(experiment.key, result.variationId);
        // Note: we don't need to tell the backend, as it's the backend that tells us to run experiments
      },
    });

    if (experiments && experiments.length > 0) {
      for (let experiment of experiments) {
        // Remap
        experiment = {
          key: experiment.experimentId,
          variations: experiment.variations,
          force: experiment.variationId,
          running: false,
        };

        this.experiments.push(experiment);
      }
    }
  }

  /**
   * Returns the variation to display
   * @param key
   * @returns string
   */
  run(key): string {
    if (this.growthbook) {
      for (let experiment of this.experiments) {
        if (experiment.key === key) {
          const { value } = this.growthbook.run(experiment);
          if (!experiment.running) {
            analytics.addExperimentContext(experiment.key, experiment.force);
            experiment.running = true;
          }
          return String(value);
        }
      }
    }

    return '';
  }
}

export default new ExperimentsService();
