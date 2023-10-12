import { RouteProp, useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import { MoreStackParamList } from '../../navigation/NavigationTypes';
import InputContainer from '../../common/components/InputContainer';
import CenteredLoading from '../../common/components/CenteredLoading';
import i18n from '../../common/services/i18n.service';
import { showNotification } from '../../../AppMessages';
import MText from '../../common/components/MText';
import { tenant } from '~/config/Config';

type DisableTFARouteProp = RouteProp<MoreStackParamList, 'DisableTFA'>;

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
    <ScrollView style={[theme.flexContainer]} keyboardShouldPersistTaps>
      <MText style={[styles.text, theme.colorSecondaryText]}>
        {i18n.t('settings.TFADisableDesc', { tenant })}
      </MText>
      {store.appAuthEnabled && (
        <InputContainer
          containerStyle={theme.bgPrimaryBackgroundHighlight}
          labelStyle={theme.colorPrimaryText}
          style={theme.colorPrimaryText}
          autoFocus
          placeholder={i18n.t('settings.TFAEnterCode')}
          onChangeText={store.setAppCode}
          value={store.appCode}
          keyboardType={'number-pad'}
        />
      )}
      {(store.smsAuthEnabled ||
        (store.appAuthEnabled && store.appCode.length === 6)) && (
        <TouchableOpacity
          onPress={onPress}
          style={[
            styles.disableButton,
            theme.bcolorPrimaryBorder,
            theme.bgPrimaryBackgroundHighlight,
          ]}>
          <MText style={theme.fontL}>{i18n.t('settings.TFADisableYes')}</MText>
        </TouchableOpacity>
      )}
    </ScrollView>
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
    marginVertical: 35,
  },
  disableButton: {
    marginTop: 35,
    paddingVertical: 17,
    paddingLeft: 22,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
});

export default DisableTFA;
