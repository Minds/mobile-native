/* eslint-disable no-shadow */
import _ from 'lodash';
import { observer } from 'mobx-react';
import { AnimatePresence } from 'moti';
import React, { useCallback, useReducer, useRef } from 'react';
import { showNotification } from '../../AppMessages';
import UserModel from '../channel/UserModel';
import FitScrollView from '../common/components/FitScrollView';
import InputBase from '../common/components/InputBase';
import InputContainer, {
  InputContainerImperativeHandle,
} from '../common/components/InputContainer';
import InputSelectorV2 from '../common/components/InputSelectorV2';
import Link from '../common/components/Link';
import MenuItemOption from '../common/components/menus/MenuItemOption';
import StripeCardSelector from '../common/components/stripe-card-selector/StripeCardSelector';
import TopbarTabbar from '../common/components/topbar-tabbar/TopbarTabbar';
import i18nService from '../common/services/i18n.service';
import { B1, B2, Button, IconButton, ModalFullScreen } from '../common/ui';
import { IS_IOS } from '../config/Config';
import NavigationService from '../navigation/NavigationService';
import ThemedStyles from '../styles/ThemedStyles';
import {
  SupermindOnboardingOverlay,
  useSupermindOnboarding,
} from './SupermindOnboarding';
import { hasVariation } from 'ExperimentsProvider';
import { PosterStackScreenProps } from './PosterOptions/PosterStackNavigator';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';

const showError = (error: string) =>
  showNotification(error, 'danger', undefined);

export enum ReplyType {
  text = 0,
  image = 1,
  video = 2,
  live = 3,
}

enum PaymentType {
  cash = 0,
  token = 1,
}

const replyOptions = [
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
  {
    value: ReplyType.live,
    label: 'Live',
  },
];

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

type SupermindState = {
  channel?: UserModel;
  replyType?: ReplyType;
  requireTwitter?: boolean;
  termsAgreed?: boolean;
  paymentMethod?: PaymentType;
  cardId?: string;
  offer?: string;
  errors?: any;
};
type SupermindStateFn = (
  prev: SupermindState,
  next: SupermindState,
) => SupermindState;

type PropsType = PosterStackScreenProps<'ComposeSupermind'>;

/**
 * Compose Screen
 * @param {Object} props
 */
const SupermindComposeScreen: React.FC<PropsType> = props => {
  const theme = ThemedStyles.style;
  const { params } = props.route ?? {};
  const { data, closeComposerOnClear, onClear } = params ?? {};
  const offerRef = useRef<InputContainerImperativeHandle>(null);

  const { min_cash = 0, min_offchain_tokens = 0 } =
    data?.channel?.supermind_settings ?? {};

  const defaultPaymentMethod =
    data?.payment_options?.payment_type ?? IS_IOS
      ? PaymentType.token
      : PaymentType.cash;

  const minValue =
    defaultPaymentMethod === PaymentType.cash ? min_cash : min_offchain_tokens;

  const [
    {
      channel,
      replyType,
      requireTwitter,
      termsAgreed,
      paymentMethod,
      cardId,
      offer,
      errors = {},
    },
    setState,
  ] = useReducer<SupermindStateFn>(
    (prevState, nextState) => ({ ...prevState, ...nextState }),
    {
      channel: data?.channel,
      replyType: data?.reply_type ?? ReplyType.text,
      requireTwitter: data?.twitter_required ?? false,
      termsAgreed: data?.terms_agreed ?? false,
      paymentMethod: defaultPaymentMethod,
      cardId: data?.payment_options?.payment_method_id,
      offer: data?.payment_options?.amount
        ? String(data?.payment_options?.amount)
        : `${minValue}`,
    },
  );

  const isTwitterEnabled = hasVariation([
    'engine-2503-twitter-feats',
    'mob-twitter-oauth-4715',
  ]);

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
    } else if (offer?.includes('.') && offer.split('.')[1].length > 2) {
      err.offer = i18nService.t('supermind.maxTwoDecimals');
    }
    if (!termsAgreed) {
      err.termsAgreed = 'You have to agree to the Terms';
    }
    const hasErrors = Object.keys(err).length > 0;

    if (hasErrors) {
      showError(err[Object.keys(err)[0]]);
      setState({ errors: err });
    }
    return !hasErrors;
  }, [cardId, channel, offer, paymentMethod, termsAgreed, minValue]);

  const onBack = useCallback(() => {
    onClear?.();

    if (closeComposerOnClear) {
      props.navigation.pop(2);
    } else {
      props.navigation.goBack();
    }
  }, [closeComposerOnClear, onClear, props.navigation]);

  const onSave = useCallback(() => {
    if (!validate()) {
      return;
    }

    const supermindRequest: SupermindRequestParam = {
      channel: channel!,
      payment_options: {
        amount: Number(offer),
        payment_method_id: cardId!,
        payment_type: paymentMethod ?? PaymentType.cash,
      },
      reply_type: replyType ?? ReplyType.text,
      twitter_required: requireTwitter ?? false,
      terms_agreed: termsAgreed ?? false,
    };

    // if object wasn't dirty, just go back without saving
    if (_.isEqual(supermindRequest, data)) {
      NavigationService.goBack();
      return;
    }

    NavigationService.goBack();
    params?.onSave?.(supermindRequest);
  }, [
    validate,
    channel,
    offer,
    cardId,
    paymentMethod,
    replyType,
    termsAgreed,
    requireTwitter,
    data,
    params,
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
            onChange={paymentMethod => setState({ paymentMethod })}
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
              onSelect: (channel?: UserModel) => setState({ channel }),
            });
            setState({ errors: { ...errors, username: '' } });
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
              setState({
                offer: value.length > 1 ? value.replace(/^0+/, '') : value,
                errors: {
                  ...errors,
                  offer: '',
                },
              });
            }
          }}
          hint={`Min: ${minValue}`}
          value={offer}
          error={errors.offer}
          autoCorrect={false}
          containerStyle={theme.paddingTop4x}
          returnKeyType="next"
          onFocus={() =>
            setState({
              errors: {
                ...errors,
                offer: '',
              },
            })
          }
          keyboardType="numeric"
        />
        {paymentMethod === PaymentType.cash && (
          <StripeCardSelector
            selectedCardId={cardId}
            onCardSelected={card => {
              setState({
                cardId: card.id,
                errors: {
                  ...errors,
                  card: '',
                },
              });
            }}
            error={errors.card}
          />
        )}
        <InputSelectorV2
          onSelected={replyType => setState({ replyType })}
          selected={replyType}
          label="Response Type"
          data={replyOptions}
          valueExtractor={v => v.label}
          keyExtractor={v => v.value}
        />
        {isTwitterEnabled && (
          <MenuItemOption
            containerItemStyle={styles.twitterMenuItem}
            onPress={() => setState({ requireTwitter: !requireTwitter })}
            selected={requireTwitter}
            disabled={replyType === ReplyType.live}
            title={i18nService.t('supermind.requireTwitter')}
            mode="checkbox"
            multiLine
          />
        )}
        <MenuItemOption
          onPress={() => setState({ termsAgreed: !termsAgreed })}
          title={
            <B1>
              I agree to the{' '}
              <Link url="https://www.minds.com/p/monetization-terms">
                Terms
              </Link>
            </B1>
          }
          selected={termsAgreed}
          mode="checkbox"
          iconColor={errors.termsAgreed ? 'Alert' : undefined}
          borderless
        />
        <B2 color="secondary" horizontal="L" top="S">
          {i18nService.t('supermind.7daysToReply')}
        </B2>
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
};

export default withErrorBoundaryScreen(
  observer(SupermindComposeScreen),
  'SupermindComposeScreen',
);

const styles = ThemedStyles.create({
  twitterMenuItem: ['bgPrimaryBackground', { borderBottomWidth: 0 }],
});
