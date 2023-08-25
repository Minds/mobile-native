import { observer } from 'mobx-react';
import sessionService from '~/common/services/session.service';
import {
  useBoostRotatorStore,
  withBoostRotatorStore,
} from './boost-rotator.store';
import BoostRotatorCarousel from './components/BoostRotatorCarousel';
import BoostRotatorHeader from './components/BoostRotatorHeader';
import BoostRotatorPageIndicator from './components/BoostRotatorPageIndicator';
import { useCallback, useEffect } from 'react';
import NewsfeedStore from '../NewsfeedStore';

function BoostRotator() {
  const user = sessionService.getUser();
  const store = useBoostRotatorStore(true);

  const refresh = useCallback(() => {
    store.fetch();
    store.setActiveIndex(0);
  }, [store]);

  useEffect(() => {
    NewsfeedStore.events.on('feedChange', refresh);

    return () => {
      NewsfeedStore.events.off('feedChange', refresh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (user.disabled_boost || !store.activites.length) {
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
