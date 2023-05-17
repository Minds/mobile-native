import { observer } from 'mobx-react';
import sessionService from '~/common/services/session.service';
import { withBoostRotatorStore } from './boost-rotator.store';
import BoostRotatorCarousel from './components/BoostRotatorCarousel';
import BoostRotatorHeader from './components/BoostRotatorHeader';
import BoostRotatorPageIndicator from './components/BoostRotatorPageIndicator';

function BoostRotator() {
  const user = sessionService.getUser();

  if (user.disabled_boost) {
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
