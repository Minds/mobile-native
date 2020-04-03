//@ts-nocheck
import React, {
  Component
} from 'react';

import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Picker,
  Alert,
} from 'react-native';

import { List, ListItem } from 'react-native-elements';
import { Button } from 'react-native-elements';
import i18n from '../../common/services/i18n.service';
import StripeCardCarousel from '../../wire/methods/StripeCardCarousel';
import StripeCardSelector from '../../wire/methods/StripeCardSelector';
import ThemedStyles from '../../styles/ThemedStyles';

export default class BillingScreen extends Component {

  onSelectCard = (card) => {
    return;
  }

  render() {
    const CS = ThemedStyles.style;
    return (
      <View style={CS.columnAlignCenter}>
        <Text style={[CS.marginTop2x, CS.fontHairline, CS.fontXL, CS.marginBottom2x]}>{i18n.t('wire.selectCredit')}</Text>
        <StripeCardSelector onCardSelected={this.onSelectCard}/>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
  },
});
