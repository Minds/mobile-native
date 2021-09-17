import experimentsService from '../services/experiments.service';

export default function useExperiment(experimentId: string) {
  return experimentsService.run(experimentId);
}
