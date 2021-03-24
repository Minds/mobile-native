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
    <View style={[theme.flexContainer, theme.paddingTop7x]}>
      <Text style={styles.title}>2. Recovery codes</Text>
      <Text style={[styles.text, theme.colorSecondaryText]}>
        Recovery codes are used to access your account in the event you cannot
        receive two-factor authentication codes.
      </Text>
      <Text style={[styles.text, theme.colorSecondaryText]}>
        Please make sure to store this information securely. If you lose it we
        can not guarantee that you will regain access to your account
      </Text>
      <View
        style={[
          theme.padding4x,
          theme.borderTop,
          theme.borderBottom,
          theme.borderPrimary,
          theme.backgroundPrimaryHighlight,
          theme.marginTop5x,
        ]}>
        <View style={theme.rowJustifySpaceBetween}>
          <Text style={styles.smallTitle}>Recovery codes</Text>
          <TouchableOpacity
            style={[theme.rowJustifyStart, theme.centered]}
            onPress={store.copyRecoveryCode}>
            <Icon
              name="content-copy"
              color={ThemedStyles.getColor('primary_text')}
              size={14}
            />
            <Text style={[styles.smallTitle, theme.marginLeft]}>Copy</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Text style={styles.textCode}>{store.recoveryCode}</Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  title: {
    paddingLeft: 20,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
  },
  smallTitle: {
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
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
