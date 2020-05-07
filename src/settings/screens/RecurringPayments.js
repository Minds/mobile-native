//@ts-nocheck
import React, { useCallback, useState, useEffect } from 'react';
import paymentService from '../../common/services/payment.service';
import CenteredLoading from '../../common/components/CenteredLoading';
import { View, Text } from 'react-native-animatable';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { ListItem } from 'react-native-elements';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import Button from '../../common/components/Button';

export default function () {
  const theme = ThemedStyles.style;

  const [subscriptions, setSubscriptions] = useState();
  const [loading, setLoading] = useState(true);

  const keyExtractor = useCallback((item, index) => index.toString());

  useEffect(() => {
    async function getSubscriptions() {
      const subscriptions = await paymentService.subscriptions();
      setSubscriptions(subscriptions);
      setLoading(false);
    }
    getSubscriptions();
  }, [setSubscriptions, setLoading]);

  const cancel = useCallback(
    async (id) => {
      setLoading(true);
      await paymentService.cancelSubscriptions(id);
      const subscriptions = await paymentService.subscriptions();
      setSubscriptions(subscriptions);
      setLoading(false);
    },
    [setLoading],
  );

  const renderRow = useCallback(
    ({ item }, i) => {
      const username = item.entity
        ? item.entity.type == 'user'
          ? item.entity.username
          : item.entity.ownerObj.username
        : '';

      let payment = '';
      let amount = 0;
      switch (item.payment_method) {
        case 'money':
          payment = 'USD';
          amount = item.amount;
          break;
        case 'tokens':
          payment = 'Tokens';
          amount = Number(item.amount) / Math.pow(10, 18);
          break;
        case 'points':
          payment = 'Points';
          amount = Number.parseFloat(item.amount);
          break;
        case 'usd':
          payment = 'USD';
          amount = Number(item.amount) / Math.pow(10, 2);
          break;
      }

      const title = (
        <View style={theme.rowJustifySpaceBetween}>
          <Text>{`${item.plan_id} @${username} ${amount} ${payment}`}</Text>
          <Button text={i18n.t('cancel')} onPress={() => cancel(item.id)} />
        </View>
      );
      return (
        <ListItem
          key={item.id}
          title={title}
          containerStyle={[
            theme.backgroundSecondary,
            theme.borderHair,
            theme.borderPrimary,
            styles.containerPadding,
          ]}
          titleStyle={[
            theme.colorSecondaryText,
            theme.fontL,
            theme.paddingLeft,
          ]}
        />
      );
    },
    [cancel],
  );

  const empty = (
    <Text style={[theme.fontM, theme.colorSecondaryText, theme.textCenter]}>
      {i18n.t('settings.subscriptionListEmpty')}
    </Text>
  );

  const component = loading ? (
    <CenteredLoading />
  ) : (
    <ScrollView style={[theme.flexContainer, theme.padding4x]}>
      <FlatList
        data={subscriptions.slice()}
        renderItem={renderRow}
        keyExtractor={keyExtractor}
        ListEmptyComponent={empty}
        style={[theme.backgroundSecondary, theme.flexContainer]}
      />
    </ScrollView>
  );
  return component;
}

const styles = {
  containerPadding: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
};
