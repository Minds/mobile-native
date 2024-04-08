import { observer } from 'mobx-react';
import React from 'react';

import FitScrollView from '~/common/components/FitScrollView';
import MenuItemOption from '~/common/components/menus/MenuItemOption';
import { B1, Button, Column, H2, H3, HairlineRow, Screen } from '~/common/ui';
import { showNotification } from '../../../../../AppMessages';
import { useTranslation } from '../../locales';
import { useBoostStore } from '../boost.store';
import { BoostStackScreenProps } from '../navigator';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import BoostComposerHeader from '../components/BoostComposerHeader';

type AudienceSelectorScreenProps =
  BoostStackScreenProps<'BoostAudienceSelector'>;

function AudienceSelectorScreen({
  navigation,
  route,
}: AudienceSelectorScreenProps) {
  const { t } = useTranslation();
  const { safe, backIcon } = route.params ?? ({} as Record<string, any>);
  const boostStore = useBoostStore();

  if (!boostStore.config) {
    showNotification('Boost config not found', 'danger');
    navigation.goBack();
    return null;
  }

  const onNext = () => {
    navigation.push('BoostComposer');
  };

  return (
    <Screen safe onlyTopEdge={!safe}>
      <BoostComposerHeader backIcon={backIcon} />
      <FitScrollView>
        <Column align="centerBoth" bottom="XL2" top="XL">
          <H2>{t('Customize your audience')}</H2>
          <B1 color="secondary">
            {t('Choose the best audience for this boost.')}
          </B1>
        </Column>

        <HairlineRow />

        <Column vertical="L" horizontal="M" top="L2">
          <H3 horizontal="L" bottom="S">
            {t('Audience')}
          </H3>
          <MenuItemOption
            title={t('Safe')}
            subtitle={t(
              'Content that is suitable if your kids or grandma saw it.',
            )}
            borderless
            mode="radio"
            selected={boostStore.audience === 'safe'}
            onPress={() => boostStore.setAudience('safe')}
          />
          <MenuItemOption
            title={t('Controversial')}
            subtitle={t(
              "Content that's political in nature or likely to be upsetting/controversial to a family-friendly audience.",
            )}
            borderless
            mode="radio"
            selected={boostStore.audience === 'mature'}
            onPress={() => boostStore.setAudience('mature')}
          />
        </Column>
      </FitScrollView>
      <Button
        onPress={onNext}
        mode="solid"
        type="action"
        horizontal="L"
        bottom="L">
        {t('Next')}
      </Button>
    </Screen>
  );
}

export default withErrorBoundaryScreen(
  observer(AudienceSelectorScreen),
  'AudienceSelectorScreen',
);
