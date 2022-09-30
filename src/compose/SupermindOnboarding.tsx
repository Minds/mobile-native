import { MotiView } from 'moti';
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import GradientButton from '../common/components/GradientButton';
import MText from '../common/components/MText';
import { useLegacyStores } from '../common/hooks/use-stores';
import openUrlService from '../common/services/open-url.service';
import { DismissIdentifier } from '../common/stores/DismissalStore';
import { B2, Column, H4, Icon, Row } from '../common/ui';
import { IconMapNameType } from '../common/ui/icons/map';
import ThemedStyles from '../styles/ThemedStyles';

const onboardingTypes = {
  producer: {
    title: 'Get paid to reply to your fans.',
    steps: [
      {
        title: 'How to earn',
        description:
          'Fans send offers of cash and tokens, which you earn by simply replying. Minds collects just a 10% platform fee (vs. 30% fees on other platforms), and our payment processor charges a small fee per transaction.',
        icon: 'money',
        link: {
          title: 'See terms and conditions.',
          onPress: () => openUrlService.open('https://www.minds.com/p/terms'),
        },
      },
      {
        title: "It's your content",
        description:
          'Your replies are public for all of your followers, so everyone benefits from the interaction.',
        icon: 'sms',
      },
      {
        title: 'Limitations',
        description:
          "Once you accept an offer, your reply can't be deleted. And NSFW content is currently not supported with Supermind.",
        icon: 'delete',
      },
    ],
  },
  consumer: {
    title:
      'Get replies from your favorite creators by sending them paid offers.',
    steps: [
      {
        title: 'Set an offer amount',
        description:
          'Send an offer of cash or tokens. The creator earns the offer amount when they reply.',
        icon: 'money',
      },
      {
        title: 'Prompt with a public post',
        description:
          'You’ll make a new public post that the target creator can reply to.',
        icon: 'sms',
      },
      {
        title: 'Get a reply',
        description:
          'Creators have 7 days to reply to your post. You will not be charged if they do not reply.',
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
    <View style={[styles.container, style]}>
      <H4 bottom="XL2" left="S">
        {onboardingTypes[type].title}
      </H4>
      {onboardingTypes[type].steps.map(step => (
        <Row right="XL2" bottom="L2">
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
    </View>
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
  container: [
    'paddingHorizontal4x',
    'paddingTop6x',
    'paddingBottom6x',
    'flexContainer',
  ],
  overlay: ['absoluteFill', 'bgPrimaryBackground'],
  link: [
    'colorSecondaryText',
    {
      textDecorationLine: 'underline',
    },
  ],
});
