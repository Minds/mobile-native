import { BoostType } from '~/boost/legacy/createBoostStore';
import { ScreenHeader } from '~/common/ui';
import { IconMapNameType } from '~/common/ui/icons/map';
import { useTranslation } from '../../locales';
import { useBoostStore } from '../boost.store';

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
    /** @deprecated */
    offer: t('Boost Offer'),
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
