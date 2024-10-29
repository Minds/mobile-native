import MPressable from '~/common/components/MPressable';
import { B2, Button, Column } from '~/common/ui';

import sp from '~/services/serviceProvider';

const SpamPrompt = ({ onPress }) => {
  return (
    <MPressable onPress={onPress} style={styles.spamPrompt}>
      <Column flex>
        <B2 color="secondary">{sp.i18n.t('comments.spamPrompt')}</B2>
      </Column>
      <Button size="tiny" mode="outline" onPress={onPress}>
        {sp.i18n.t('comments.spamPromptAction')}
      </Button>
    </MPressable>
  );
};

const styles = sp.styles.create({
  spamPrompt: [
    'borderHair',
    'bcolorPrimaryBorder',
    'padding4x',
    'rowJustifyCenter',
    'margin2x',
    'marginBottom4x',
  ],
});

export default SpamPrompt;
