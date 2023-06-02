import { useDimensions } from '@react-native-community/hooks';
import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';

import i18n from '~/common/services/i18n.service';
import { RootStackParamList } from '~/navigation/NavigationTypes';
import ModalContainer from '~/onboarding/v2/steps/ModalContainer';
import ThemedStyles from '~/styles/ThemedStyles';
import ChooseBrowser from '../components/ChooseBrowser';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';

type ChooseBrowserModalScreenRouteProp = RouteProp<
  RootStackParamList,
  'ChooseBrowserModal'
>;
type ChooseBrowserModalScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChooseBrowserModal'
>;

type PropsType = {
  route: ChooseBrowserModalScreenRouteProp;
  navigation: ChooseBrowserModalScreenNavigationProp;
};

/**
 * Choose browser modal screen
 */
const ChooseBrowserModalScreen = ({ navigation, route }: PropsType) => {
  const onSelected = React.useCallback(() => {
    navigation.goBack();
    if (route.params?.onSelected) {
      route.params?.onSelected();
    }
  }, [navigation, route.params]);

  const { height } = useDimensions().window;

  return (
    <ModalContainer
      title={i18n.t('settings.chooseBrowser')}
      onPressBack={navigation.goBack}
      marginTop={height / 3}
      contentContainer={containerStyle}>
      <ChooseBrowser onSelected={onSelected} />
    </ModalContainer>
  );
};

export default withErrorBoundaryScreen(
  ChooseBrowserModalScreen,
  'ChooseBrowserModal',
);

const containerStyle = ThemedStyles.combine(
  'bgPrimaryBackgroundHighlight',
  'alignSelfCenterMaxWidth',
  {
    height: 400,
  },
);
