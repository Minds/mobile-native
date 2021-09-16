import { RouteProp, useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import { AppStackParamList } from '../../navigation/NavigationTypes';
import InputContainer from '../../common/components/InputContainer';
import CenteredLoading from '../../common/components/CenteredLoading';
import i18n from '../../common/services/i18n.service';
import { showNotification } from '../../../AppMessages';

type DisableTFARouteProp = RouteProp<AppStackParamList, 'DisableTFA'>;

type PropsType = {
  route: DisableTFARouteProp;
};

const DisableTFA = observer(({ route }: PropsType) => {
  const theme = ThemedStyles.style;
  const { store, password } = route.params;
  const navigation = useNavigation();

  const onComplete = () => {
    navigation.goBack();
    showNotification(i18n.t('settings.TFADisabled'));
  };

  const onPress = () => {
    if (store.appAuthEnabled && store.appCode === '') {
      showNotification(
        "You must enter the your authentication app's code",
        'warning',
      );
      return;
    }
    store.setLoading(true);
    store.disable2fa(onComplete, password);
  };

  if (store.loading) {
    return <CenteredLoading />;
  }

  return (
    <ScrollView style={theme.flexContainer} keyboardShouldPersistTaps>
      <Text style={styles.text}>{i18n.t('settings.TFADisableDesc')}</Text>
      {store.appAuthEnabled && (
        <InputContainer
          containerStyle={theme.bgPrimaryBackgroundHighlight}
          labelStyle={theme.colorPrimaryText}
          style={theme.colorPrimaryText}
          placeholder={i18n.t('settings.TFAEnterCode')}
          onChangeText={store.setAppCode}
          value={store.appCode}
          keyboardType={'number-pad'}
        />
      )}
      {(store.smsAuthEnabled ||
        (store.appAuthEnabled && store.appCode.length === 6)) && (
        <TouchableOpacity onPress={onPress} style={styles.disableButton}>
          <Text style={theme.fontL}>{i18n.t('settings.TFADisableYes')}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
});

const styles = ThemedStyles.create({
  title: [
    {
      paddingLeft: 20,
      fontWeight: '500',
      fontFamily: 'Roboto-Medium',
      fontSize: 20,
    },
  ],
  smallTitle: [
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
      marginVertical: 35,
    },
  ],
  disableButton: [
    'bcolorPrimaryBorder',
    'bgPrimaryBackgroundHighlight',
    {
      marginTop: 35,
      paddingVertical: 17,
      paddingLeft: 22,
      borderTopWidth: 1,
      borderBottomWidth: 1,
    },
  ],
});

export default DisableTFA;
