import { observer } from 'mobx-react';
import { View } from 'react-native';
import ThemedStyles from '~/styles/ThemedStyles';
import { useBoostRotatorStore } from '../boost-rotator.store';
import Pagination from './pagination/Pagination';

function BoostRotatorPageIndicator() {
  const boostRotatorStore = useBoostRotatorStore();

  let activeIndex = boostRotatorStore.activeIndex;
  if (boostRotatorStore.activeIndex >= 2) {
    activeIndex = 2;
  }
  const itemsLeft =
    boostRotatorStore.activites.length - (boostRotatorStore.activeIndex + 1);
  if (itemsLeft <= 2) {
    activeIndex = 5 - itemsLeft - 1;
  }

  return (
    <View style={styles.container}>
      <Pagination
        activeDotIndex={activeIndex}
        dotsLength={5}
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
