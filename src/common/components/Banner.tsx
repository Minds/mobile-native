import { observer } from 'mobx-react';
import { ReactNode } from 'react';

import { useLegacyStores } from '../hooks/use-stores';
import { DismissIdentifier } from '../stores/DismissalStore';
import { Button, Column, IconButton } from '../ui';
import MPressable from './MPressable';
import { Typography, TypographyType } from '../ui/typography/Typography';
import type { ClickRef } from '../services/analytics.service';
import sp from '~/services/serviceProvider';

export interface BannerProps {
  dismissIdentifier?: DismissIdentifier;
  actionIdentifier?: ClickRef;
  text: string | ReactNode;
  actionText?: string;
  onPress?: () => void;
  onAction?: () => void;
  typography?: TypographyType;
}

function Banner({
  dismissIdentifier,
  actionIdentifier,
  text,
  onPress,
  actionText,
  typography = 'B1',
  ...props
}: BannerProps) {
  const { dismissal } = useLegacyStores();

  const onDismiss = () =>
    dismissIdentifier && dismissal.dismiss(dismissIdentifier);

  const onAction = () => {
    if (actionIdentifier) {
      sp.resolve('analytics').trackClick(actionIdentifier);
    }
    props.onAction?.();
  };

  if (dismissIdentifier && dismissal.isDismissed(dismissIdentifier)) {
    return null;
  }

  return (
    <MPressable style={styles.container} onPress={onPress}>
      <Column flex align="centerStart">
        {typeof text === 'string' ? (
          <Typography type={typography} font="medium">
            {text}
          </Typography>
        ) : (
          text
        )}
      </Column>
      {actionText && (
        <Button
          type="action"
          mode="solid"
          onPress={onAction}
          left="S"
          size="small">
          {actionText}
        </Button>
      )}
      {!!dismissIdentifier && (
        <IconButton
          scale
          left="S"
          name="close"
          color="PrimaryText"
          onPress={onDismiss}
        />
      )}
    </MPressable>
  );
}

const styles = sp.styles.create({
  container: [
    'borderBottomHair',
    'borderTopHair',
    'bcolorAction',
    'paddingLeft3x',
    'paddingRight4x',
    'paddingVertical3x',
    'rowJustifySpaceBetween',
  ],
});

export default observer(Banner);
