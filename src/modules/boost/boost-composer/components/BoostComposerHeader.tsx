import { ScreenHeader } from '~/common/ui';
import { IconMapNameType } from '~/common/ui/icons/map';
import { useTranslation } from '../../locales';
import { BoostType, useBoostStore } from '../boost.store';

export default function BoostComposerHeader({
  backIcon,
}: {
  backIcon?: IconMapNameType;
}) {
  const boostStore = useBoostStore();
  const { t } = useTranslation();

  const titleMap: Record<BoostType, string> = {
    channel: t('Boost Channel'),
    post: t('Boost Post'),
    group: t('Boost Group'),
  };

  return (
    <ScreenHeader
      title={titleMap[boostStore.boostType]}
      back
      backIcon={backIcon}
      shadow
    />
  );
}
