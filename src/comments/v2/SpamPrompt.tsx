import MPressable from '~/common/components/MPressable';
import { B2, Button, Column } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import i18nService from '~/common/services/i18n.service';

const SpamPrompt = ({ onPress }) => {
  return (
    <MPressable onPress={onPress} style={styles.spamPrompt}>
      <Column flex>
        <B2 color="secondary">{i18nService.t('comments.spamPrompt')}</B2>
      </Column>
      <Button size="tiny" mode="outline" onPress={onPress}>
        {i18nService.t('comments.spamPromptAction')}
      </Button>
    </MPressable>
  );
};

const styles = ThemedStyles.create({
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
