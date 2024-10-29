import { RouteProp, useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { MoreStackParamList } from '~/navigation/NavigationTypes';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import InputContainer from '~/common/components/InputContainer';
import CenteredLoading from '~/common/components/CenteredLoading';
import SaveButton from '~/common/components/SaveButton';
import { showNotification } from '~/../AppMessages';
import MText from '~/common/components/MText';
import sp from '~/services/serviceProvider';

type VerifyAuthAppRouteProp = RouteProp<
  MoreStackParamList,
  'RecoveryCodesScreen'
>;

type PropsType = {
  route: VerifyAuthAppRouteProp;
};

const VerifyAuthAppScreen = observer(({ route }: PropsType) => {
  const theme = sp.styles.style;
  const { store } = route.params ?? {};
  const navigation = useNavigation();
  const i18n = sp.i18n;

  const onComplete = () => {
    store?.setLoading(false);
    store?.setAuthEnabled('app');
    store?.setAppCode('');
    navigation.navigate('RecoveryCodesScreen', { store });
  };

  const onContinue = () => {
    if (store?.appCode === '') {
      showNotification(
        "You must enter the your authentication app's code",
        'warning',
      );
      return;
    }
    store?.setLoading(true);
    store?.submitCode(onComplete);
  };

  navigation.setOptions({
    headerRight: () => (
      <SaveButton onPress={onContinue} text={i18n.t('continue')} />
    ),
  });

  useEffect(() => {
    const loadSecret = async () => {
      try {
        store?.setLoading(true);
        await store?.fetchSecret();
      } catch (err) {
        if (err instanceof Error) {
          showNotification(err.message, 'warning');
        }
      } finally {
        store?.setLoading(false);
      }
    };
    loadSecret();
  }, [store]);

  if (store?.loading) {
    return <CenteredLoading />;
  }

  return (
    <ScrollView style={[theme.flexContainer, theme.paddingTop7x]}>
      <MText style={styles.title}>{i18n.t('settings.TFAVerifyTitle')}</MText>
      <MText style={[styles.text, theme.colorSecondaryText]}>
        {i18n.t('settings.TFAVerifyDesc')}
      </MText>
      <View
        style={[
          theme.rowJustifySpaceBetween,
          theme.paddingHorizontal4x,
          theme.marginBottom7x,
        ]}>
        <MText style={styles.smallTitle}>{store?.secret}</MText>
        <TouchableOpacity
          style={[theme.rowJustifyStart, theme.centered]}
          onPress={store?.copySecret}>
          <Icon
            name="content-copy"
            color={sp.styles.getColor('PrimaryText')}
            size={14}
          />
          <MText style={[styles.smallTitle, theme.marginLeft]}>
            {i18n.t('copy')}
          </MText>
        </TouchableOpacity>
      </View>
      <InputContainer
        containerStyle={theme.bgPrimaryBackgroundHighlight}
        labelStyle={theme.colorPrimaryText}
        style={theme.colorPrimaryText}
        placeholder={i18n.t('settings.TFAEnterCode')}
        onChangeText={store?.setAppCode}
        value={store?.appCode}
      />
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
});

export default VerifyAuthAppScreen;
