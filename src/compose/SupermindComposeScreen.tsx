import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { showNotification } from '../../AppMessages';
import UserModel from '../channel/UserModel';
import FitScrollView from '../common/components/FitScrollView';
import InputBase from '../common/components/InputBase';
import InputContainer from '../common/components/InputContainer';
import InputSelectorV2 from '../common/components/InputSelectorV2';
import MenuItem from '../common/components/menus/MenuItem';
import StripeCardSelector from '../common/components/stripe-card-selector/StripeCardSelector';
import TopbarTabbar from '../common/components/topbar-tabbar/TopbarTabbar';
import i18nService from '../common/services/i18n.service';
import { Button, Icon, ModalFullScreen } from '../common/ui';
import { IS_IOS } from '../config/Config';
import NavigationService from '../navigation/NavigationService';
import { RootStackParamList } from '../navigation/NavigationTypes';
import ThemedStyles from '../styles/ThemedStyles';

const showError = (error: string) =>
  showNotification(error, 'danger', undefined);

type PasswordConfirmation = RouteProp<RootStackParamList, 'SupermindCompose'>;
type Navigation = StackNavigationProp<RootStackParamList, 'SupermindCompose'>;

export enum ReplyType {
  text = 0,
  image = 1,
  video = 2,
}

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
export default function SupermindComposeScreen(props: SupermindComposeScreen) {
  const theme = ThemedStyles.style;
  const data: SupermindRequestParam | undefined = props.route?.params?.data;
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
  const [offer, setOffer] = useState(
    data?.payment_options?.amount
      ? String(data?.payment_options?.amount)
      : '10',
  );
  const [errors, setErrors] = useState<any>({});
  const [tabsDisabled, setTabsDisabled] = useState<any>(IS_IOS);

  const validate = useCallback(() => {
    const err: any = {};
    if (!channel) {
      err.username = 'Please select a target channel';
    }
    if (paymentMethod === PaymentType.cash && !cardId) {
      err.card = 'Card is required';
    }
    if (!offer || !Number(offer) || Number.isNaN(Number(offer))) {
      err.offer = 'Offer is not valid';
    } else if (offer && Number(offer) < 10) {
      err.offer = 'Offer must be greater than 10';
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
  }, [cardId, channel, offer, paymentMethod, termsAgreed]);

  const onBack = useCallback(() => {
    props.route?.params?.onClear();

    if (props.route?.params?.closeComposerOnClear) {
      props.navigation.pop(2);
    } else {
      props.navigation.goBack();
    }
  }, [props.route]);

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
   * A user can only pay in cash where the producer has
   * a bank account connected to their minds account
   */
  useEffect(() => {
    if (!channel) {
      return;
    }

    if (IS_IOS) {
      return;
    }

    if (!channel.merchant) {
      setPaymentMethod(PaymentType.token);
      setTabsDisabled(true);
    } else {
      setTabsDisabled(false);
    }
  }, [channel]);

  return (
    <ModalFullScreen
      title={'Supermind'}
      leftComponent={
        <Button mode="flat" size="small" onPress={onBack}>
          {i18nService.t('searchBar.clear')}
        </Button>
      }
      extra={
        <Button mode="flat" size="small" type="action" onPress={onSave}>
          {i18nService.t('done')}
        </Button>
      }>
      <FitScrollView keyboardShouldPersistTaps="handled">
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
          placeholder={`Offer (${
            paymentMethod === PaymentType.cash ? 'USD' : 'Token'
          })`}
          autofocus={Boolean(data?.channel)}
          onChangeText={value => {
            setOffer(value);
            setErrors(err => ({
              ...err,
              offer: '',
            }));
          }}
          hint="Min: 10"
          value={offer}
          error={errors.offer}
          inputType="number"
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
          item={{
            onPress: () => setRequireTwitter(val => !val),
            title: 'Require the reply to be posted to @ottman on Twitter',
            icon: (
              <Icon
                size={30}
                name={requireTwitter ? 'checkbox-marked' : 'checkbox-blank'}
                color={requireTwitter ? 'Link' : 'Icon'}
              />
            ),
          }}
        /> */}
        <MenuItem
          containerItemStyle={styles.termsContainer}
          item={{
            onPress: () => setTermsAgreed(val => !val),
            title: 'I agree to the Terms',
            icon: (
              <Icon
                size={30}
                name={termsAgreed ? 'checkbox-marked' : 'checkbox-blank'}
                color={
                  termsAgreed ? 'Link' : errors.termsAgreed ? 'Alert' : 'Icon'
                }
              />
            ),
          }}
        />
      </FitScrollView>
    </ModalFullScreen>
  );
}

const styles = ThemedStyles.create({
  termsContainer: [
    'bgPrimaryBackground',
    { borderTopWidth: 0, borderBottomWidth: 0 },
  ],
});
