import { MotiView } from 'moti';
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import FitScrollView from '~/common/components/FitScrollView';
import { IS_IOS } from '~/config/Config';
import GradientButton from '../common/components/GradientButton';
import MText from '../common/components/MText';
import { useLegacyStores } from '../common/hooks/use-stores';
import i18n from '../common/services/i18n.service';
// import openUrlService from '../common/services/open-url.service';
import { DismissIdentifier } from '../common/stores/DismissalStore';
import { B2, Column, H4, Icon, Row } from '../common/ui';
import { IconMapNameType } from '../common/ui/icons/map';
import ThemedStyles from '../styles/ThemedStyles';

const onboardingTypes = {
  producer: {
    title: i18n.t('supermind.onboarding.producer.title'),
    steps: [
      {
        title: i18n.t('supermind.onboarding.producer.steps.1.title'),
        description: IS_IOS
          ? i18n.t('supermind.onboarding.producer.steps.1.subtitle-iOS')
          : i18n.t('supermind.onboarding.producer.steps.1.subtitle'),
        icon: 'money',
        link: {
          title: i18n.t('supermind.onboarding.producer.steps.1.seeTerms'),
          onPress: () => null, // openUrlService.open('https://www.minds.com/p/terms'),
        },
      },
      {
        title: i18n.t('supermind.onboarding.producer.steps.2.title'),
        description: i18n.t('supermind.onboarding.producer.steps.2.subtitle'),
        icon: 'sms',
      },
      {
        title: i18n.t('supermind.onboarding.producer.steps.3.title'),
        description: i18n.t('supermind.onboarding.producer.steps.3.subtitle'),
        icon: 'delete',
      },
    ],
  },
  consumer: {
    title: IS_IOS
      ? i18n.t('supermind.onboarding.consumer.title-iOS')
      : i18n.t('supermind.onboarding.consumer.title'),
    steps: [
      {
        title: i18n.t('supermind.onboarding.consumer.steps.1.title'),
        description: IS_IOS
          ? i18n.t('supermind.onboarding.consumer.steps.1.subtitle-iOS')
          : i18n.t('supermind.onboarding.consumer.steps.1.subtitle'),
        icon: 'money',
      },
      {
        title: i18n.t('supermind.onboarding.consumer.steps.2.title'),
        description: i18n.t('supermind.onboarding.consumer.steps.2.subtitle'),
        icon: 'sms',
      },
      {
        title: i18n.t('supermind.onboarding.consumer.steps.3.title'),
        description: i18n.t('supermind.onboarding.consumer.steps.3.subtitle'),
        icon: 'date-range',
      },
    ],
  },
};

type SupermindOnboardingType = 'consumer' | 'producer';

interface SupermindOnboardingProps {
  type: SupermindOnboardingType;
  style?: StyleProp<ViewStyle>;
  onDismiss: () => void;
}

export default function SupermindOnboarding({
  type,
  style,
  onDismiss,
}: SupermindOnboardingProps) {
  return (
    <FitScrollView style={style} contentContainerStyle={styles.container}>
      <H4 bottom="XL2" left="S">
        {onboardingTypes[type].title}
      </H4>
      {onboardingTypes[type].steps.map((step, index) => (
        <Row key={index} right="XL2" bottom="L2">
          <Column right="L">
            <Icon top="XS" name={step.icon as IconMapNameType} size={30} />
          </Column>
          <Column right="L">
            <H4 font="bold">{step.title}</H4>
            <B2 color="secondary">
              {step.description}{' '}
              {Boolean(step.link) && (
                <MText style={styles.link} onPress={step.link.onPress}>
                  {step.link.title}
                </MText>
              )}
            </B2>
          </Column>
        </Row>
      ))}
      <View style={ThemedStyles.style.flexContainer} />
      <GradientButton
        testID="dismissButton"
        title="Continue"
        onPress={onDismiss}
      />
    </FitScrollView>
  );
}

/**
 * Must be used with AnimatePresence for the unmount animation to work
 */
export function SupermindOnboardingOverlay(props: SupermindOnboardingProps) {
  return (
    <MotiView from={from} animate={animate} exit={exit} style={styles.overlay}>
      <SupermindOnboarding {...props} />
    </MotiView>
  );
}

export const useSupermindOnboarding = (type: SupermindOnboardingType) => {
  const id = `supermind:onboarding:${type}` as DismissIdentifier;
  const { dismissal } = useLegacyStores();

  return [!dismissal.isDismissed(id), () => dismissal.dismiss(id)] as [
    boolean,
    () => void,
  ];
};

const from = { opacity: 1 };
const animate = { opacity: 1 };
const exit = {
  opacity: 0,
};

const styles = ThemedStyles.create({
  container: ['paddingHorizontal4x', 'paddingTop6x', 'paddingBottom6x'],
  overlay: ['absoluteFill', 'bgPrimaryBackground'],
  link: [
    'colorSecondaryText',
    {
      textDecorationLine: 'underline',
    },
  ],
});
