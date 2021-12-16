import { observer } from 'mobx-react';
import featuresService from '../services/features.service';

export default observer(function Feature({
  children,
  feature,
}: {
  children: any;
  feature: string;
}) {
  if (featuresService.has(feature)) {
    return children;
  }
  return null;
});
