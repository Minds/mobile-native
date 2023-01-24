import { observer } from 'mobx-react';
import React from 'react';
import { showNotification } from '../../../../../AppMessages';
import FitScrollView from '~/common/components/FitScrollView';
import MenuItemOption from '~/common/components/menus/MenuItemOption';
import {
  B1,
  Button,
  Column,
  H2,
  H3,
  HairlineRow,
  Screen,
  ScreenHeader,
} from '~/common/ui';
import { useBoostStore } from '../boost.store';
import { useTranslation } from '../../locales';
import { BoostStackScreenProps } from '../navigator';

type AudienceSelectorScreenProps = BoostStackScreenProps<'BoostAudienceSelector'>;

function AudienceSelectorScreen({ navigation }: AudienceSelectorScreenProps) {
  const { t } = useTranslation();
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
    <Screen screenName="AudienceSelectorScreen" safe>
      <ScreenHeader
        title={
          boostStore.boostType === 'channel'
            ? t('Boost Channel')
            : t('Boost Post')
        }
        back
        shadow
      />
      <FitScrollView>
        <Column align="centerBoth" vertical="XL2">
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

export default observer(AudienceSelectorScreen);
