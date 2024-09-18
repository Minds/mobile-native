import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../../navigation/NavigationTypes';
import {
  View,
  Dimensions,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import SettingInput from '../../../common/components/SettingInput';

import QRCode from 'react-native-qrcode-svg';
import LabeledComponent from '../../../common/components/LabeledComponent';
import MText from '../../../common/components/MText';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import sp from '~/services/serviceProvider';

export type ReceiverAddressScreenRouteProp = RouteProp<
  AppStackParamList,
  'ReceiverAddressScreen'
>;
export type ReceiverAddressScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ReceiverAddressScreen'
>;

function getQRSize(scale = 1) {
  const { height, width } = Dimensions.get('window');
  return Math.floor((width < height ? width : height) * scale);
}

type PropsType = {
  navigation: ReceiverAddressScreenNavigationProp;
  route: ReceiverAddressScreenRouteProp;
};

const ReceiverAddressScreen = ({ route }: PropsType) => {
  const theme = sp.styles.style;
  const { walletStore } = route.params;
  const receiver = walletStore.wallet.receiver;

  if (!receiver || !receiver.address) {
    return null;
  }

  const qrWrapper = [
    theme.padding4x,
    theme.bgSecondaryBackground,
    theme.centered,
    theme.marginTop6x,
    theme.marginBottom3x,
  ];

  qrWrapper.push(
    Platform.OS === 'ios' ? styles.iOSShadow : styles.androidShadow,
  );

  return (
    <ScrollView style={theme.paddingTop3x}>
      <SettingInput
        placeholder="Address Label"
        value={receiver.label}
        editable={false}
        wrapperBorder={[theme.borderTop, theme.borderBottom]}
      />

      <View style={theme.marginBottom7x}>
        <View style={qrWrapper}>
          <QRCode
            value={`ethereum:${receiver.address.toLowerCase()}`}
            size={getQRSize(1 / 2)}
          />
        </View>
        <MText style={theme.textCenter}>{receiver.address.toLowerCase()}</MText>
      </View>

      <View
        style={[
          theme.rowJustifyStart,
          theme.paddingLeft4x,
          theme.marginBottom4x,
        ]}>
        <LabeledComponent label={'Balance'} labelStyle={styles.labelStyle}>
          <MText style={theme.fontXL}>{receiver.balance}</MText>
        </LabeledComponent>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  iOSShadow: {
    shadowOffset: {
      width: 1,
      height: -1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  androidShadow: {
    elevation: 5,
  },
  labelStyle: {
    fontSize: 15,
    marginBottom: 5,
  },
});

export default withErrorBoundaryScreen(
  ReceiverAddressScreen,
  'ReceiverAddressScreen',
);
