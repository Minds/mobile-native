import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { observer, useLocalStore } from 'mobx-react';
import React, { forwardRef, useRef } from 'react';
import { InteractionManager } from 'react-native';
import { showNotification } from '../../../../AppMessages';
import ThemedStyles from '../../../styles/ThemedStyles';
import { StripeCard } from '../../../wire/WireTypes';
import i18n from '../../services/i18n.service';
import { Row } from '../../ui';
import { BottomSheetButton, BottomSheetModal } from '../bottom-sheet';
import InputSelector, { InputSelectorProps } from '../InputSelectorV2';
import createCardSelectorStore, {
  selectIdExtractor,
  selectValueExtractor,
} from './createCardSelectorStore';

type StripeCardSelectorProps = {
  selectedCardId?: string;
  onCardSelected: (card: StripeCard) => void;
  info?: string;
  error?: string;
} & Pick<InputSelectorProps, 'containerStyle' | 'borderless'>;

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
    const bottomSheetRef = useRef<any>(null);
    const { confirmSetupIntent } = useStripe();

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

    return (
      <>
        <InputSelector
          {...inputSelectorProps}
          onSelected={store.selectCard}
          selected={store.currentCardId}
          label={i18n.t('buyTokensScreen.paymentMethod')}
          data={[
            ...store.cards,
            {
              name: i18n.t('wire.addCard'),
              id: 'newCard',
              iconName: 'add',
              onPress: () =>
                InteractionManager.runAfterInteractions(() => show()),
            },
          ]}
          valueExtractor={selectValueExtractor}
          keyExtractor={selectIdExtractor}
          textStyle={ThemedStyles.style.fontXL}
          backdropOpacity={0.9}
        />
        <NewCardBottomSheet
          ref={bottomSheetRef}
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
