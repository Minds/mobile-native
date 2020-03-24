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

export default class BillingScreen extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>{i18n.t('settings.paymentMethods')}</Text>
        <View style={styles.cardcontainer}>
          <Text style={styles.creditcardtext}>{i18n.t('settings.addCard')}</Text>
          <Button backgroundColor="#4690D6"
            title={i18n.t('settings.add')} icon={{ name: 'ios-card', type: 'ionicon'}} />
        </View>
        <Text style={styles.header}>{i18n.t('settings.recurringPayments')}</Text>
        <Text style={[styles.header, { marginTop: 20 }]}>{i18n.t('categories')}</Text>
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
