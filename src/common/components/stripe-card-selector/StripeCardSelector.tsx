import { CardField, useStripe } from '@stripe/stripe-react-native';
import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import { showNotification } from '~/../AppMessages';

import { StripeCard } from '~/wire/WireTypes';
import { Row, Icon, IconButton } from '../../ui';
import { BottomSheetButton, pushBottomSheet } from '../bottom-sheet';
import createCardSelectorStore, {
  GIFTSCARD,
  selectValueExtractor,
} from './createCardSelectorStore';
import InputBase from '../InputBase';
import { StyleProp, ViewStyle } from 'react-native';
import MenuItem from '../menus/MenuItem';
import sp from '~/services/serviceProvider';

type StripeCardSelectorProps = {
  selectedCardId?: string;
  onCardSelected: (card: StripeCard) => void;
  info?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  borderless?: boolean;
  creditLabel?: string;
};

const StripeCardSelector = observer(
  ({
    onCardSelected,
    selectedCardId,
    creditLabel,
    ...inputSelectorProps
  }: StripeCardSelectorProps) => {
    const i18n = sp.i18n;
    const store = useLocalStore(createCardSelectorStore, {
      onCardSelected,
      selectedCardId,
    });

    React.useEffect(() => {
      store.init();
    }, [store]);

    const currentCard =
      store.cards?.length > 0 ? store.cards[store.current] : undefined;

    const giftSelected =
      selectedCardId === GIFTSCARD.id || (creditLabel && !selectedCardId);

    return (
      <InputBase
        onPress={() => pushCardSelectorBottomSheet(store, creditLabel)}
        {...inputSelectorProps}
        label={i18n.t('orderReport.paymentMethod')}
        value={giftSelected ? creditLabel : selectValueExtractor(currentCard)}
        icon={<Icon name="chevron-down" />}
      />
    );
  },
);

const pushCardSelectorBottomSheet = (store, creditLabel) => {
  const i18n = sp.i18n;
  return pushBottomSheet({
    safe: true,
    component: bottomSheetRef => (
      <>
        {creditLabel ? (
          <MenuItem
            title={creditLabel}
            borderless
            onPress={() => {
              store.selectCard(GIFTSCARD.id);
              bottomSheetRef.close();
            }}
            titleStyle={
              store.isGiftCards() ? sp.styles.style.colorLink : undefined
            }
          />
        ) : null}
        {store.cards.map((card, index) => (
          <MenuItem
            key={`${card.id}`}
            title={selectValueExtractor(card)}
            titleStyle={
              !store.isGiftCards() && index === store.current
                ? sp.styles.style.colorLink
                : undefined
            }
            onPress={() => {
              store.selectCard(card.id);
              bottomSheetRef.close();
            }}
            icon={
              <IconButton
                name="close"
                style={sp.styles.style.colorPrimaryText}
                onPress={() => store.removeCard(index)}
              />
            }
          />
        ))}

        <BottomSheetButton
          text={i18n.t('wire.addCard')}
          onPress={() => pushNewCardBottomSheet(store)}
          action
        />
        <BottomSheetButton
          text={i18n.t('cancel')}
          onPress={() => bottomSheetRef.close()}
        />
      </>
    ),
  });
};

const pushNewCardBottomSheet = store => {
  const i18n = sp.i18n;
  return pushBottomSheet({
    safe: true,
    snapPoints: ['90%'],
    component: bottomSheetRef => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { confirmSetupIntent } = useStripe();

      const onComplete = async () => {
        store.setInProgress(true);

        const { error, setupIntent } = await confirmSetupIntent(
          store.intentKey,
          {
            paymentMethodType: 'Card',
          },
        );
        if (setupIntent) {
          await store.saveCard();
          bottomSheetRef.close();
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

      return (
        <>
          <Row align="centerBoth" bottom="XL">
            <CardField
              postalCodeEnabled={false}
              autofocus
              onCardChange={store.onCardChange}
              cardStyle={{
                ...cardStyle,
                ...{
                  textColor: sp.styles.getColor('PrimaryText'),
                  textErrorColor: sp.styles.getColor('Alert'),
                  placeholderColor: sp.styles.getColor('SecondaryText'),
                  backgroundColor: sp.styles.getColor('TertiaryBackground'),
                  borderColor: sp.styles.getColor('SecondaryBackground'),
                },
              }}
              style={styles.cardContainer}
            />
          </Row>
          {!store.cardDetailsComplete && (
            <BottomSheetButton
              text={i18n.t('cancel')}
              onPress={() => bottomSheetRef.close()}
            />
          )}
          {store.cardDetailsComplete && (
            <BottomSheetButton
              action
              text={i18n.t('wire.addCard')}
              onPress={() => onComplete()}
              loading={store.inProgress}
            />
          )}
        </>
      );
    },
  });
};

const cardStyle = {
  borderWidth: 1,
  borderRadius: 8,
  fontSize: 14,
};

const styles = sp.styles.create({
  container: ['rowJustifySpaceBetween', 'padding2x'],
  cardContainer: [{ width: '90%', height: 200 }],
});

export default StripeCardSelector;
