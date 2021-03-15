import { RouteProp, useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ModalConfirmPassword from '../ModalConfirmPassword';
import MenuItem from '../../common/components/menus/MenuItem';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { AppStackParamList } from '../../navigation/NavigationTypes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

  return (
    <View style={[theme.flexContainer, theme.paddingTop7x]}>
      <Text style={styles.title}>1. Recovery codes</Text>
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
            onPress={() => false}>
            <Icon
              name="content-copy"
              color={ThemedStyles.getColor('primary_text')}
              size={14}
            />
            <Text style={[styles.smallTitle, theme.marginLeft]}>Copy</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Text style={styles.textCode}>
            dff4d-e3b62 a7940-58cf9 bfbd7-757e5 93b14-c2e90 05233-724b1
            0560f-87f28 3e539-9a4f3 ee6a2-4f6db
          </Text>
          <Text style={styles.textCode}>
            71e75-21909 bb1d9-9e5ca e2441-5142f a105d-7db8c 2486c-a7dfe
            163cb-5b2f9 32332-09c32 1b378-454b1
          </Text>
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
