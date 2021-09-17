import React from 'react';
import useExperiment from '../hooks/useExperiment';

type Props = {
  experiment: string;
  variation: string;
};

/**
 * Show children only when the variation matches
 */
const Experiment: React.FC<Props> = ({ experiment, variation, children }) => {
  const varId = useExperiment(experiment);
  if (variation === varId) {
    return <>{children}</>;
  }
  return null;
};

export default Experiment;
