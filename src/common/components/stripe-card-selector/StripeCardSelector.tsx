import { useDimensions } from '@react-native-community/hooks';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { observer, useLocalStore } from 'mobx-react';
import React, { useRef } from 'react';
import { View, Text } from 'react-native';
import { showNotification } from '../../../../AppMessages';
import ThemedStyles from '../../../styles/ThemedStyles';
import i18n from '../../services/i18n.service';
import { BottomSheet, BottomSheetButton } from '../bottom-sheet';
import MenuItem from '../menus/MenuItem';
import Selector from '../SelectorV2';
import createCardSelectorStore, {
  selectIdExtractor,
  selectValueExtractor,
} from './createCardSelectorStore';

type PropsType = {
  onCardSelected: Function;
};

const cardPlaceHolder = {
  number: '4242 4242 4242 4242',
  postalCode: '12345',
  cvc: 'CVC',
  expiration: 'MM|YY',
};

const StripeCardSelector = observer(({ onCardSelected }: PropsType) => {
  const store = useLocalStore(createCardSelectorStore, { onCardSelected });
  const { confirmSetupIntent } = useStripe();

  const selectorRef = useRef<any>(null);
  const bottomSheetRef = useRef<any>(null);

  const screenHeight = useDimensions().screen.height;

  React.useEffect(() => {
    store.init();
  }, [store]);

  const close = React.useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);
  const show = React.useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const onComplete = async () => {
    store.setInProgress(true);

    const { error, setupIntent } = await confirmSetupIntent(store.intentKey, {
      type: 'Card',
    });
    if (setupIntent) {
      await store.saveCard();
      close();
    } else {
      store.setInProgress(false);
      console.log(error);
      showNotification(
        error?.localizedMessage || i18n.t('errorMessage'),
        'warning',
        3000,
        'top',
      );
    }
  };

  const currentCard = store.current
    ? {
        title: store.currentCardTitle,
        icon: { name: 'chevron-down', type: 'material-community' },
        onPress: () => selectorRef.current?.show(store.currentCardId),
      }
    : null;

  return (
    <View>
      <View style={styles.container}>
        <Text>{i18n.t('wire.selectCard').toUpperCase()}</Text>
        <Text onPress={show}>{i18n.t('wire.addCard')}</Text>
      </View>
      {!!store.current && (
        <>
          {!!currentCard && <MenuItem item={currentCard} />}
          <Selector
            ref={selectorRef}
            onItemSelect={store.selectCard}
            title={''}
            data={store.cards}
            valueExtractor={selectValueExtractor}
            keyExtractor={selectIdExtractor}
            textStyle={ThemedStyles.style.fontXL}
            backdropOpacity={0.9}
          />
        </>
      )}
      <BottomSheet ref={bottomSheetRef} snapPoints={[screenHeight * 0.7]}>
        <View style={ThemedStyles.style.alignCenter}>
          <CardField
            postalCodeEnabled={false}
            autofocus
            placeholder={cardPlaceHolder}
            onCardChange={store.onCardChange}
            cardStyle={{
              ...cardStyle,
              ...{
                textColor: ThemedStyles.getColor('PrimaryText'),
                textErrorColor: ThemedStyles.getColor('Alert'),
                placeholderColor: ThemedStyles.getColor('SecondaryText'),
                backgroundColor: ThemedStyles.getColor('PrimaryBackground'),
                borderColor: ThemedStyles.getColor('PrimaryBorder'),
              },
            }}
            style={styles.cardContainer}
          />
        </View>
        {!store.cardDetailsComplete && (
          <BottomSheetButton text={i18n.t('cancel')} onPress={close} />
        )}
        {store.cardDetailsComplete && (
          <BottomSheetButton
            text={i18n.t('wire.addCard')}
            onPress={onComplete}
            loading={store.inProgress}
          />
        )}
      </BottomSheet>
    </View>
  );
});

const cardStyle = {
  borderWidth: 1,
  borderRadius: 8,
  fontSize: 14,
};

const styles = ThemedStyles.create({
  container: ['rowJustifySpaceBetween', 'padding2x'],
  cardContainer: [{ width: '90%', height: 200 }],
});

export default StripeCardSelector;
