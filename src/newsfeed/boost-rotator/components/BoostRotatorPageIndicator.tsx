import { observer } from 'mobx-react';
import { View } from 'react-native';
import ThemedStyles from '~/styles/ThemedStyles';
import { useBoostRotatorStore } from '../boost-rotator.store';
import Pagination from './pagination/Pagination';

const DOTS_LENGTH = 5;
const MIDDLE_INDEX = 2;

function BoostRotatorPageIndicator() {
  const boostRotatorStore = useBoostRotatorStore();

  let activeIndex = boostRotatorStore.activeIndex;
  if (boostRotatorStore.activeIndex >= MIDDLE_INDEX) {
    activeIndex = MIDDLE_INDEX;
  }
  const itemsLeft =
    boostRotatorStore.activites.length - (boostRotatorStore.activeIndex + 1);
  if (itemsLeft <= MIDDLE_INDEX) {
    activeIndex = DOTS_LENGTH - itemsLeft - 1;
  }

  return (
    <View style={styles.container}>
      <Pagination
        activeDotIndex={activeIndex}
        dotsLength={DOTS_LENGTH}
        dotColor={ThemedStyles.getColor('SecondaryText')}
        inactiveDotColor={ThemedStyles.getColor('PrimaryText')}
      />
    </View>
  );
}

export default observer(BoostRotatorPageIndicator);

const styles = ThemedStyles.create({
  container: [
    'borderBottom6x',
    'bcolorBaseBackground',
    'alignCenter',
    'paddingBottom4x',
  ],
});
