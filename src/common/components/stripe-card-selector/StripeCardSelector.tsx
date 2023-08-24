import { CardField, useStripe } from '@stripe/stripe-react-native';
import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import { showNotification } from '~/../AppMessages';
import ThemedStyles from '~/styles/ThemedStyles';
import { StripeCard } from '~/wire/WireTypes';
import i18n from '../../services/i18n.service';
import { Row, Icon, IconButton } from '../../ui';
import { BottomSheetButton, pushBottomSheet } from '../bottom-sheet';
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

    React.useEffect(() => {
      store.init();
    }, [store]);

    const currentCard =
      store.cards?.length > 0 ? store.cards[store.current] : undefined;

    return (
      <InputBase
        onPress={() => pushCardSelectorBottomSheet(store)}
        {...inputSelectorProps}
        label={i18n.t('orderReport.paymentMethod')}
        value={selectValueExtractor(currentCard)}
        icon={<Icon name="chevron-down" />}
      />
    );
  },
);

const pushCardSelectorBottomSheet = store => {
  return pushBottomSheet({
    safe: true,
    component: bottomSheetRef => (
      <>
        {store.cards.map((card, index) => (
          <MenuItem
            title={selectValueExtractor(card)}
            titleStyle={
              index === store.current ? ThemedStyles.style.colorLink : undefined
            }
            onPress={() => {
              store.selectCard(card.id);
              bottomSheetRef.close();
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
              onPress={() => bottomSheetRef.close()}
            />
          )}
          {store.cardDetailsComplete && (
            <BottomSheetButton
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

const styles = ThemedStyles.create({
  container: ['rowJustifySpaceBetween', 'padding2x'],
  cardContainer: [{ width: '90%', height: 200 }],
});

export default StripeCardSelector;
