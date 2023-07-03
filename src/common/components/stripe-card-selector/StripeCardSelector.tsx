import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { observer, useLocalStore } from 'mobx-react';
import React, { forwardRef, useRef } from 'react';
import { showNotification } from '../../../../AppMessages';
import ThemedStyles from '../../../styles/ThemedStyles';
import { StripeCard } from '../../../wire/WireTypes';
import i18n from '../../services/i18n.service';
import { Row, Icon, IconButton } from '../../ui';
import { BottomSheetButton, BottomSheetModal } from '../bottom-sheet';

import createCardSelectorStore, {
  selectValueExtractor,
} from './createCardSelectorStore';
import InputBase from '../InputBase';
import { StyleProp, ViewStyle } from 'react-native';
import MenuItem from '../menus/MenuItem';

type StripeCardSelectorProps = {
  selectedCardId?: string;
  onCardSelected: (card: StripeCard) => void;
  info?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  borderless?: boolean;
};

const StripeCardSelector = observer(
  ({
    onCardSelected,
    selectedCardId,
    ...inputSelectorProps
  }: StripeCardSelectorProps) => {
    const store = useLocalStore(createCardSelectorStore, {
      onCardSelected,
      selectedCardId,
    });
    const addCardBottomSheetRef = useRef<any>(null);
    const bottomSheetRef = useRef<any>(null);
    const { confirmSetupIntent } = useStripe();

    React.useEffect(() => {
      store.init();
    }, [store]);

    const close = React.useCallback(() => {
      addCardBottomSheetRef.current?.dismiss();
    }, []);
    const show = React.useCallback(() => {
      addCardBottomSheetRef.current?.present();
    }, []);

    const onComplete = async () => {
      store.setInProgress(true);

      const { error, setupIntent } = await confirmSetupIntent(store.intentKey, {
        paymentMethodType: 'Card',
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
    const currentCard =
      store.cards?.length > 0 ? store.cards[store.current] : undefined;
    return (
      <>
        <InputBase
          onPress={() => bottomSheetRef.current?.present()}
          {...inputSelectorProps}
          label={i18n.t('orderReport.paymentMethod')}
          value={selectValueExtractor(currentCard)}
          icon={<Icon name="chevron-down" />}
        />
        <BottomSheetModal ref={bottomSheetRef}>
          {store.cards.map((card, index) => (
            <MenuItem
              title={selectValueExtractor(card)}
              titleStyle={
                index === store.current
                  ? ThemedStyles.style.colorLink
                  : undefined
              }
              onPress={() => {
                store.selectCard(card.id);
                bottomSheetRef.current?.dismiss();
              }}
              icon={
                <IconButton
                  name="close"
                  style={ThemedStyles.style.colorPrimaryText}
                  onPress={() => store.removeCard(index)}
                />
              }
            />
          ))}

          <BottomSheetButton
            text={i18n.t('wire.addCard')}
            onPress={show}
            action
          />
          <BottomSheetButton
            text={i18n.t('cancel')}
            onPress={() => bottomSheetRef.current?.dismiss()}
          />
        </BottomSheetModal>
        <NewCardBottomSheet
          ref={addCardBottomSheetRef}
          store={store}
          onComplete={onComplete}
        />
      </>
    );
  },
);

const NewCardBottomSheet = observer(
  forwardRef<any, any>(({ store, onComplete }, ref) => {
    const bottomSheet = useBottomSheetModal();
    return (
      <BottomSheetModal ref={ref}>
        <Row align="centerBoth" bottom="XL">
          <CardField
            postalCodeEnabled={false}
            autofocus
            onCardChange={store.onCardChange}
            cardStyle={{
              ...cardStyle,
              ...{
                textColor: ThemedStyles.getColor('PrimaryText'),
                textErrorColor: ThemedStyles.getColor('Alert'),
                placeholderColor: ThemedStyles.getColor('SecondaryText'),
                backgroundColor: ThemedStyles.getColor('TertiaryBackground'),
                borderColor: ThemedStyles.getColor('SecondaryBackground'),
              },
            }}
            style={styles.cardContainer}
          />
        </Row>
        {!store.cardDetailsComplete && (
          <BottomSheetButton
            text={i18n.t('cancel')}
            onPress={() => bottomSheet.dismiss()}
          />
        )}
        {store.cardDetailsComplete && (
          <BottomSheetButton
            text={i18n.t('wire.addCard')}
            onPress={onComplete}
            loading={store.inProgress}
          />
        )}
      </BottomSheetModal>
    );
  }),
);

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
