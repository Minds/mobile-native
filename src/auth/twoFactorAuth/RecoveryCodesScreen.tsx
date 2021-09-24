import { RouteProp, useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import { AppStackParamList } from '../../navigation/NavigationTypes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SaveButton from '../../common/components/SaveButton';
import i18n from '../../common/services/i18n.service';
import { showNotification } from '../../../AppMessages';

type RecoveryCodesRouteProp = RouteProp<
  AppStackParamList,
  'RecoveryCodesScreen'
>;

type PropsType = {
  route: RecoveryCodesRouteProp;
};

const RecoveryCodesScreen = observer(({ route }: PropsType) => {
  const theme = ThemedStyles.style;

  const store = route.params.store;

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
    <View style={styles.mainContainer}>
      <Text style={styles.title}>
        {i18n.t('settings.TFARecoveryCodesTitle')}
      </Text>
      <Text style={styles.text}>{i18n.t('settings.TFARecoveryCodesDesc')}</Text>
      <Text style={styles.text}>
        {i18n.t('settings.TFARecoveryCodesBeSure')}
      </Text>
      <View style={styles.recoveryContainer}>
        <View style={theme.rowJustifySpaceBetween}>
          <Text style={styles.smallTitle}>
            {i18n.t('settings.TFARecoveryCodes')}
          </Text>
          <TouchableOpacity
            style={styles.touchable}
            onPress={store.copyRecoveryCode}>
            <Icon
              name="content-copy"
              color={ThemedStyles.getColor('PrimaryText')}
              size={14}
            />
            <Text style={styles.smallTitle}>{i18n.t('copy')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Text style={styles.textCode}>{store.recoveryCode}</Text>
        </View>
      </View>
    </View>
  );
});

const styles = ThemedStyles.create({
  mainContainer: ['flexContainer', 'paddingTop7x'],
  recoveryContainer: [
    'padding4x',
    'borderTop',
    'borderBottom',
    'bcolorPrimaryBorder',
    'bgPrimaryBackgroundHighlight',
    'marginTop5x',
  ],
  touchable: ['rowJustifyStart', 'centered'],
  title: [
    {
      paddingLeft: 20,
      fontWeight: '500',
      fontFamily: 'Roboto-Medium',
      fontSize: 20,
    },
  ],
  smallTitle: [
    'marginLeft',
    {
      fontWeight: '500',
      fontFamily: 'Roboto-Medium',
      fontSize: 16,
    },
  ],
  text: [
    'colorSecondaryText',
    {
      fontSize: 16,
      paddingLeft: 20,
      paddingRight: 20,
      marginVertical: 15,
    },
  ],
  container: [
    {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      marginTop: 25,
    },
  ],
  textCode: [
    {
      width: '50%',
      fontSize: 16,
      fontWeight: '700',
      paddingRight: 35,
    },
  ],
});

export default RecoveryCodesScreen;
