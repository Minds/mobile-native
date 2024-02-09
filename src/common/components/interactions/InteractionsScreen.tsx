import { RouteProp, useRoute } from '@react-navigation/native';
import type UserModel from '~/channel/UserModel';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import Interactions from '~/common/components/interactions/Interactions';
import { getTitle as getInteractionTitle } from '~/common/components/interactions/InteractionsBottomSheet';
import capitalize from '~/common/helpers/capitalize';
import { Screen, ScreenHeader } from '~/common/ui';
import { AppStackParamList } from '~/navigation/NavigationTypes';
import type ActivityModel from '~/newsfeed/ActivityModel';
import { Interactions as InteractionType } from './Interactions';

export type InteractionsScreenParams = {
  entity: ActivityModel | UserModel;
  interaction: InteractionType;
};

function InteractionsScreen() {
  const { params } = useRoute<RouteProp<AppStackParamList, 'Interactions'>>();
  const { entity, interaction } = params;

  return (
    <Screen safe onlyTopEdge>
      <ScreenHeader back title={capitalize(getInteractionTitle(interaction))} />
      <Interactions entity={entity} interaction={interaction} />
    </Screen>
  );
}

export default withErrorBoundaryScreen(
  InteractionsScreen,
  'InteractionsScreen',
);
