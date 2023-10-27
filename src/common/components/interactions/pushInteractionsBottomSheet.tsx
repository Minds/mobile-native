import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import Delayed from '../Delayed';
import { pushBottomSheet } from '../bottom-sheet';
import Interactions from './Interactions';
import { Dimensions } from 'react-native';
import capitalize from '../../helpers/capitalize';
import { getTitle } from './InteractionsBottomSheet';
import NavigationService from '~/navigation/NavigationService';

const { height: windowHeight } = Dimensions.get('window');
const MAX_HEIGHT = Math.floor(windowHeight * 0.8);
const DEFAULT_SNAP_POINTS = [MAX_HEIGHT + 70];

/**
 * @see {@link pushInteractionsScreen}
 * @deprecated
 */
const pushInteractionsBottomSheet = ({
  entity,
  interaction,
}): Promise<boolean | null> => {
  return new Promise(resolve =>
    pushBottomSheet({
      snapPoints: DEFAULT_SNAP_POINTS,
      title: capitalize(getTitle(interaction)),
      component: (bottomSheetRef, onLayout) => (
        <SafeAreaView
          edges={EDGES}
          style={{ height: MAX_HEIGHT }}
          onLayout={onLayout}>
          <Delayed delay={0}>
            <Interactions
              entity={entity}
              interaction={interaction}
              onCancel={() => bottomSheetRef.close()}
            />
          </Delayed>
        </SafeAreaView>
      ),
      onClose: () => resolve(null),
    }),
  );
};

export const pushInteractionsScreen = ({ entity, interaction }): void =>
  NavigationService.push('Interactions', {
    entity,
    interaction,
  });

const EDGES: Edge[] = ['bottom'];

export default pushInteractionsBottomSheet;
