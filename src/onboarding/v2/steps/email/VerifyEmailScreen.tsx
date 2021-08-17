import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native';
import i18n from '../../../../common/services/i18n.service';
import NavigationService from '../../../../navigation/NavigationService';
import { RootStackParamList } from '../../../../navigation/NavigationTypes';
import ThemedStyles from '../../../../styles/ThemedStyles';
import ModalContainer from '../ModalContainer';
import Resend from './Resend';
import Verify from './Verify';

type VerifyEmailScreenRouteProp = RouteProp<RootStackParamList, 'VerifyEmail'>;

/**
 * Verify Email Modal Screen
 */
export default observer(function VerifyEmailScreen() {
  const { params } = useRoute<VerifyEmailScreenRouteProp>();
  const isVerifying = params && params.__e_cnf_token;
  const navigation = useNavigation();
  const ResendCmp = React.useMemo(() => <Resend />, []);

  React.useEffect(() => {
    return () => {
      if (isVerifying) {
        navigation.setParams({ __e_cnf_token: undefined });
      }
    };
  });

  return (
    <ModalContainer
      title={i18n.t('onboarding.verifyEmail')}
      onPressBack={NavigationService.goBack}>
      <View style={styles.container}>
        {!isVerifying && ResendCmp}
        {isVerifying && <Verify />}
      </View>
    </ModalContainer>
  );
});

const styles = ThemedStyles.create({
  container: ['flexContainer', 'paddingHorizontal4x'],
});
