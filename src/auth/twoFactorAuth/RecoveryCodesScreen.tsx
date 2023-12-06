import { RouteProp, useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import { MoreStackParamList } from '../../navigation/NavigationTypes';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import SaveButton from '../../common/components/SaveButton';
import i18n from '../../common/services/i18n.service';
import { showNotification } from '../../../AppMessages';
import MText from '../../common/components/MText';

type RecoveryCodesRouteProp = RouteProp<
  MoreStackParamList,
  'RecoveryCodesScreen'
>;

type PropsType = {
  route: RecoveryCodesRouteProp;
};

const RecoveryCodesScreen = observer(({ route }: PropsType) => {
  const theme = ThemedStyles.style;

  const { store } = route.params ?? {};

  const navigation = useNavigation();

  const onContinue = () => {
    navigation.navigate('TwoFactorAuthSettingsScreen');
    showNotification(i18n.t('settings.TFAEnabled'));
  };
  navigation.setOptions({
    headerRight: () => (
      <SaveButton onPress={onContinue} text={i18n.t('continue')} />
    ),
  });

  return (
    <View style={[theme.flexContainer, theme.paddingTop7x]}>
      <MText style={styles.title}>
        {i18n.t('settings.TFARecoveryCodesTitle')}
      </MText>
      <MText style={[styles.text, theme.colorSecondaryText]}>
        {i18n.t('settings.TFARecoveryCodesDesc')}
      </MText>
      <MText style={[styles.text, theme.colorSecondaryText]}>
        {i18n.t('settings.TFARecoveryCodesBeSure')}
      </MText>
      <View
        style={[
          theme.padding4x,
          theme.borderTop,
          theme.borderBottom,
          theme.bcolorPrimaryBorder,
          theme.bgPrimaryBackgroundHighlight,
          theme.marginTop5x,
        ]}>
        <View style={theme.rowJustifySpaceBetween}>
          <MText style={styles.smallTitle}>
            {i18n.t('settings.TFARecoveryCodes')}
          </MText>
          <TouchableOpacity
            style={[theme.rowJustifyStart, theme.centered]}
            onPress={store?.copyRecoveryCode}>
            <Icon
              name="content-copy"
              color={ThemedStyles.getColor('PrimaryText')}
              size={14}
            />
            <MText style={[styles.smallTitle, theme.marginLeft]}>
              {i18n.t('copy')}
            </MText>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <MText style={styles.textCode}>{store?.recoveryCode}</MText>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  title: {
    paddingLeft: 20,
    fontWeight: '500',
    fontFamily: 'Roboto_500Medium',
    fontSize: 20,
  },
  smallTitle: {
    fontWeight: '500',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    paddingLeft: 20,
    paddingRight: 20,
    marginVertical: 15,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginTop: 25,
  },
  textCode: {
    width: '50%',
    fontSize: 16,
    fontWeight: '700',
    paddingRight: 35,
  },
});

export default RecoveryCodesScreen;
