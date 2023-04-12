import { withBoostRotatorStore } from './boost-rotator.store';
import BoostRotatorCarousel from './components/BoostRotatorCarousel';
import BoostRotatorHeader from './components/BoostRotatorHeader';
import BoostRotatorPageIndicator from './components/BoostRotatorPageIndicator';

function BoostRotator() {
  return (
    <>
      <BoostRotatorHeader />
      <BoostRotatorCarousel />
      <BoostRotatorPageIndicator />
    </>
  );
}

export default withBoostRotatorStore(BoostRotator);
