import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import _ from 'lodash';
import { observer } from 'mobx-react';
import { AnimatePresence } from 'moti';
import React, { useCallback, useRef, useState } from 'react';
import openUrlService from '~/common/services/open-url.service';
import { showNotification } from '../../AppMessages';
import UserModel from '../channel/UserModel';
import FitScrollView from '../common/components/FitScrollView';
import InputBase from '../common/components/InputBase';
import InputContainer, {
  InputContainerImperativeHandle,
} from '../common/components/InputContainer';
import InputSelectorV2 from '../common/components/InputSelectorV2';
import MenuItemOption from '../common/components/menus/MenuItemOption';
import MText from '../common/components/MText';
import StripeCardSelector from '../common/components/stripe-card-selector/StripeCardSelector';
import TopbarTabbar from '../common/components/topbar-tabbar/TopbarTabbar';
import i18nService from '../common/services/i18n.service';
import { B1, B2, Button, IconButton, ModalFullScreen } from '../common/ui';
import { IS_IOS } from '../config/Config';
import NavigationService from '../navigation/NavigationService';
import { RootStackParamList } from '../navigation/NavigationTypes';
import ThemedStyles from '../styles/ThemedStyles';
import {
  SupermindOnboardingOverlay,
  useSupermindOnboarding,
} from './SupermindOnboarding';

const showError = (error: string) =>
  showNotification(error, 'danger', undefined);

type PasswordConfirmation = RouteProp<RootStackParamList, 'SupermindCompose'>;
type Navigation = StackNavigationProp<RootStackParamList, 'SupermindCompose'>;

// eslint-disable-next-line no-shadow
export enum ReplyType {
  text = 0,
  image = 1,
  video = 2,
}

// eslint-disable-next-line no-shadow
enum PaymentType {
  cash = 0,
  token = 1,
}

export interface SupermindRequestParam {
  channel: UserModel;
  payment_options: {
    payment_type: PaymentType;
    payment_method_id: string;
    amount: number;
  };
  reply_type: ReplyType;
  twitter_required: boolean;
  terms_agreed: boolean;
}

interface SupermindComposeScreen {
  route?: PasswordConfirmation;
  navigation: Navigation;
}

/**
 * Compose Screen
 * @param {Object} props
 */
function SupermindComposeScreen(props: SupermindComposeScreen) {
  const theme = ThemedStyles.style;
  const data: SupermindRequestParam | undefined = props.route?.params?.data;
  const offerRef = useRef<InputContainerImperativeHandle>(null);
  const [channel, setChannel] = useState<UserModel | undefined>(data?.channel);
  const [replyType, setReplyType] = useState<ReplyType>(
    data?.reply_type ?? ReplyType.text,
  );
  // const [requireTwitter, setRequireTwitter] = useState<boolean>(
  //   data?.twitter_required ?? false,
  // );
  const [termsAgreed, setTermsAgreed] = useState<boolean>(
    data?.terms_agreed || false,
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentType>(
    data?.payment_options?.payment_type || IS_IOS
      ? PaymentType.token
      : PaymentType.cash,
  );
  const [cardId, setCardId] = useState<string | undefined>(
    data?.payment_options?.payment_method_id,
  );

  const { min_cash = 0, min_offchain_tokens = 0 } =
    channel?.supermind_settings ?? {};

  const minValue =
    paymentMethod === PaymentType.cash ? min_cash : min_offchain_tokens;

  const [offer, setOffer] = useState(
    data?.payment_options?.amount
      ? String(data?.payment_options?.amount)
      : `${minValue}`,
  );
  const [errors, setErrors] = useState<any>({});
  const [onboarding, dismissOnboarding] = useSupermindOnboarding('consumer');

  // hide payment method tabs
  const tabsDisabled = IS_IOS;

  const validate = useCallback(() => {
    const err: any = {};
    if (!channel) {
      err.username = 'Please select a target channel';
    }
    if (paymentMethod === PaymentType.cash && !cardId) {
      err.card = 'Card is required';
    }
    const oferValue = Number(offer ?? '');
    if (Number.isNaN(oferValue)) {
      err.offer = 'Offer is not valid';
    } else if (oferValue < minValue) {
      err.offer = `Offer must be greater than ${minValue}`;
    } else if (offer.includes('.') && offer.split('.')[1].length > 2) {
      err.offer = i18nService.t('supermind.maxTwoDecimals');
    }
    if (!termsAgreed) {
      err.termsAgreed = 'You have to agree to the Terms';
    }
    const hasErrors = Object.keys(err).length > 0;

    if (hasErrors) {
      showError(err[Object.keys(err)[0]]);
      setErrors(err);
    }
    return !hasErrors;
  }, [cardId, channel, offer, paymentMethod, termsAgreed, minValue]);

  const onBack = useCallback(() => {
    props.route?.params?.onClear();

    if (props.route?.params?.closeComposerOnClear) {
      props.navigation.pop(2);
    } else {
      props.navigation.goBack();
    }
  }, [props.navigation, props.route]);

  const onSave = useCallback(() => {
    if (!validate()) {
      return;
    }

    const supermindRequest = {
      channel: channel!,
      payment_options: {
        amount: Number(offer),
        payment_method_id: cardId!,
        payment_type: paymentMethod,
      },
      reply_type: replyType,
      twitter_required: false,
      terms_agreed: termsAgreed,
    };

    // if object wasn't dirty, just go back without saving
    if (_.isEqual(supermindRequest, props.route?.params?.data)) {
      NavigationService.goBack();
      return;
    }

    NavigationService.goBack();
    props.route?.params?.onSave(supermindRequest);
  }, [
    validate,
    channel,
    offer,
    cardId,
    paymentMethod,
    replyType,
    termsAgreed,
    props.route,
  ]);

  /**
   * Handles dismissing the onboarding modal
   */
  const handleOnboardingDismiss = useCallback(() => {
    dismissOnboarding();
    // if the channel was filled in, focus on the offer input
    if (data?.channel) {
      offerRef.current?.focus();
    }
  }, [data, dismissOnboarding]);

  return (
    <ModalFullScreen
      title={'Supermind'}
      leftComponent={
        onboarding ? (
          <IconButton name="close" size="large" onPress={onBack} />
        ) : (
          <Button mode="flat" size="small" onPress={onBack}>
            {i18nService.t('searchBar.clear')}
          </Button>
        )
      }
      extra={
        !onboarding && (
          <Button mode="flat" size="small" type="action" onPress={onSave}>
            {i18nService.t('done')}
          </Button>
        )
      }>
      <FitScrollView
        keyboardShouldPersistTaps="handled"
        style={ThemedStyles.style.flexContainer}>
        {!tabsDisabled && (
          <TopbarTabbar
            current={paymentMethod}
            onChange={setPaymentMethod}
            containerStyle={theme.paddingTop}
            tabs={[
              { id: PaymentType.cash, title: i18nService.t('wallet.cash') },
              {
                id: PaymentType.token,
                title: i18nService.t('analytics.tokens.title'),
              },
            ]}
          />
        )}

        <InputBase
          label={'Target Channel'}
          onPress={() => {
            NavigationService.push('ChannelSelectScreen', {
              onSelect: selectedChannel => setChannel(selectedChannel),
            });
            setErrors(err => ({
              ...err,
              username: '',
            }));
          }}
          value={channel ? `@${channel.username}` : '@'}
          error={errors.username}
        />
        <InputContainer
          ref={offerRef}
          placeholder={`Offer (${
            paymentMethod === PaymentType.cash ? 'USD' : 'Token'
          })`}
          autoFocus={Boolean(data?.channel) && !onboarding}
          onChangeText={value => {
            if (/\d+\.?\d*$/.test(value) || value === '') {
              // remove leading 0
              setOffer(value.length > 1 ? value.replace(/^0+/, '') : value);
              setErrors(err => ({
                ...err,
                offer: '',
              }));
            }
          }}
          hint={`Min: ${minValue}`}
          value={offer}
          error={errors.offer}
          autoCorrect={false}
          containerStyle={theme.paddingTop4x}
          returnKeyType="next"
          onFocus={() =>
            setErrors(err => ({
              ...err,
              offer: '',
            }))
          }
          keyboardType="numeric"
        />
        {paymentMethod === PaymentType.cash && (
          <StripeCardSelector
            selectedCardId={cardId}
            onCardSelected={card => {
              setCardId(card.id);
              setErrors(err => ({
                ...err,
                card: '',
              }));
            }}
            error={errors.card}
          />
        )}
        <InputSelectorV2
          onSelected={setReplyType}
          selected={replyType}
          label="Response Type"
          data={[
            {
              value: ReplyType.text,
              label: 'Text',
            },
            {
              value: ReplyType.image,
              label: 'Image',
            },
            {
              value: ReplyType.video,
              label: 'Video',
            },
          ]}
          valueExtractor={v => v.label}
          keyExtractor={v => v.value}
        />
        {/* <MenuItem
          containerItemStyle={[
            theme.bgPrimaryBackground,
            { borderBottomWidth: 0 },
          ]}
          onPress={() => setRequireTwitter(val => !val)}
          title={'Require the reply to be posted to @ottman on Twitter'}
          icon={requireTwitter ? 'checkbox-marked' : 'checkbox-blank'}
          iconSize={30}
          iconColor={
            requireTwitter ? 'Link' : errors.termsAgreed ? 'Alert' : 'Icon'
          }
        /> */}
        <MenuItemOption
          onPress={() => setTermsAgreed(val => !val)}
          title={
            <B1>
              I agree to the{' '}
              <MText
                onPress={() =>
                  openUrlService.open(
                    'https://www.minds.com/p/monetization-terms',
                  )
                }
                style={{ textDecorationLine: 'underline' }}>
                Terms
              </MText>
            </B1>
          }
          selected={termsAgreed}
          mode="checkbox"
          iconColor={errors.termsAgreed ? 'Alert' : undefined}
          borderless
        />
      </FitScrollView>

      <AnimatePresence>
        {onboarding && (
          <SupermindOnboardingOverlay
            type="consumer"
            onDismiss={handleOnboardingDismiss}
          />
        )}
      </AnimatePresence>
    </ModalFullScreen>
  );
}

export default observer(SupermindComposeScreen);
