import { observer } from 'mobx-react';
import { ReactNode } from 'react';
import ThemedStyles from '~/styles/ThemedStyles';
import { useLegacyStores } from '../hooks/use-stores';
import { DismissIdentifier } from '../stores/DismissalStore';
import { B1, Column, IconButton } from '../ui';
import MPressable from './MPressable';

export interface BannerProps {
  name: DismissIdentifier;
  text: string | ReactNode;
  onPress: () => void;
}

function Banner({ name, text, onPress }: BannerProps) {
  const { dismissal } = useLegacyStores();

  const onDismiss = () => dismissal.dismiss(name);

  if (dismissal.isDismissed(name)) {
    return null;
  }

  return (
    <MPressable onPress={onPress} style={styles.container}>
      <Column flex>
        <B1 font="medium">{text}</B1>
      </Column>
      <IconButton
        scale
        left="S"
        name="close"
        color="PrimaryText"
        onPress={onDismiss}
      />
    </MPressable>
  );
}

const styles = ThemedStyles.create({
  container: [
    'borderBottomHair',
    'borderTopHair',
    'bcolorAction',
    'paddingLeft5x',
    'paddingRight4x',
    'paddingVertical3x',
    'rowJustifySpaceBetween',
  ],
});

export default observer(Banner);
