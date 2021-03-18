import { RouteProp, useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
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
  const store = route.params.store;
  const navigation = useNavigation();

  const onComplete = () => {
    store.setLoading(false);
    navigation.goBack();
    showNotification(i18n.t('settings.TFADisabled'));
  };

  const onPress = () => {
    if (store.appCode === '') {
      showNotification(
        "You must enter the your authentication app's code",
        'warning',
      );
      return;
    }
    store.setLoading(true);
    store.disableTotp(onComplete);
  };

  if (store.loading) {
    return <CenteredLoading />;
  }

  return (
    <ScrollView style={[theme.flexContainer]}>
      <Text style={[styles.text, theme.colorSecondaryText]}>
        Are you sure you wish to disable two-factor authentication on your Minds
        account?
      </Text>
      <InputContainer
        containerStyle={theme.backgroundPrimaryHighlight}
        labelStyle={theme.colorPrimaryText}
        style={theme.colorPrimaryText}
        placeholder={'Enter the six-digit code from the application'}
        onChangeText={store.setAppCode}
        value={store.appCode}
        autoFocus
      />
      {store.appCode.length === 6 && (
        <TouchableOpacity
          onPress={onPress}
          style={[
            styles.disableButton,
            theme.borderPrimary,
            theme.backgroundPrimaryHighlight,
          ]}>
          <Text style={theme.fontL}>Yes, Disable 2FA</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
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
