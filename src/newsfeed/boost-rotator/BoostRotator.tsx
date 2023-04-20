import { observer } from 'mobx-react';
import sessionService from '~/common/services/session.service';
import {
  useBoostRotatorStore,
  withBoostRotatorStore,
} from './boost-rotator.store';
import BoostRotatorCarousel from './components/BoostRotatorCarousel';
import BoostRotatorHeader from './components/BoostRotatorHeader';
import BoostRotatorPageIndicator from './components/BoostRotatorPageIndicator';

function BoostRotator() {
  const boostRotatorStore = useBoostRotatorStore();
  const user = sessionService.getUser();

  if (user.disabled_boost || !boostRotatorStore.activites.length) {
    return null;
  }

  return (
    <>
      <BoostRotatorHeader />
      <BoostRotatorCarousel />
      <BoostRotatorPageIndicator />
    </>
  );
}

export default withBoostRotatorStore(observer(BoostRotator));
