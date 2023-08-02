import React from 'react';
import { View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import FitScrollView from '~/common/components/FitScrollView';
import { B2, Button, Column, H4, Icon, Row } from '~/common/ui';
import { IconMapNameType } from '~/common/ui/icons/map';
import { useGetExplainerScreenQuery } from '~/graphql/strapi';
import { useDismissMutation, useGetDismissalQuery } from '~/graphql/api';
import ThemedStyles from '../styles/ThemedStyles';

type OnboardingType =
  | 'affiliates'
  | 'analytics'
  | 'boost'
  | 'groups_memberships'
  | 'minds_plus'
  | 'wallet_cash_earnings';

interface OnboardingProps {
  type: OnboardingType;
}

export default function OnboardingOverlay({ type: key }: OnboardingProps) {
  const { explainer, dismissed, onDismiss } = useExplainer(key);

  if (!explainer || dismissed) {
    return null;
  }

  const {
    subtitle = '',
    section = [],
    continueButton: { text: continueButtonText },
  } = explainer;

  return (
    <View style={styles.overlay}>
      <FitScrollView contentContainerStyle={styles.container}>
        <Column flex>
          <H4 bottom="XL2" left="S">
            {subtitle}
          </H4>
          {section.map((step, index) => (
            <Row key={index} right="XL2" bottom="L2">
              <Column right="L">
                <Icon top="XS" name={step?.icon as IconMapNameType} size={20} />
              </Column>
              <Column right="L">
                <H4 font="bold">{step?.title}</H4>
                <B2 color="secondary">{step?.description?.trim()}</B2>
              </Column>
            </Row>
          ))}
        </Column>
        <Button testID="dismissButton" type="action" onPress={onDismiss}>
          {continueButtonText ?? 'Continue'}
        </Button>
      </FitScrollView>
    </View>
  );
}

export const useExplainer = (key: string) => {
  const queryClient = useQueryClient();
  const dismiss = useDismissMutation();

  const { data: { dismissalByKey: dismissed } = {} } = useGetDismissalQuery({
    key,
  });
  // const { data: allDismissals } = useGetDismissalsQuery();
  const { data } = useGetExplainerScreenQuery({
    key,
  });

  const onDismiss = () => {
    dismiss.mutate(
      { key },
      {
        onSuccess(result) {
          queryClient.setQueryData(['GetDismissal', { key }], result);
        },
      },
    );
  };

  return {
    explainer: data?.explainerScreensWeb?.data?.[0]?.attributes,
    dismissed,
    onDismiss,
  };
};

const styles = ThemedStyles.create({
  container: ['flexContainer', 'marginTop28x', 'padding6x'],
  overlay: ['absoluteFill', 'bgPrimaryBackground'],
});
