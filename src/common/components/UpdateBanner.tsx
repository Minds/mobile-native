import Banner from './Banner';
import updateExpoService from '../services/update.expo.service';
import { useFocusEffect } from '@react-navigation/native';
import { useState } from 'react';
import i18nService from '../services/i18n.service';
import { observer } from 'mobx-react';
import useDebouncedCallback from '../hooks/useDebouncedCallback';

export default observer(function UpdateBanner() {
  const { showNote, onReload } = useUpdates();

  if (!showNote) {
    return null;
  }
  return (
    <Banner
      actionText={'Update'}
      text={i18nService.t('banners.update.title', {})}
      onAction={onReload}
    />
  );
});

const useUpdates = () => {
  const [currentlyRunning, setCurrentlyRunning] = useState(false);
  const [isUpdatePending, setIsUpdatePending] = useState(false);

  const showNote = !currentlyRunning && isUpdatePending;

  useFocusEffect(
    useDebouncedCallback(
      () => {
        const { checkForUpdate, update } = updateExpoService;
        if (currentlyRunning) {
          return;
        }
        checkForUpdate().then(result => {
          if (result) {
            setCurrentlyRunning(true);
            update()
              .then(response => {
                if (response?.isNew && response?.manifest) {
                  setIsUpdatePending(true);
                }
              })
              .catch(console.log)
              .finally(() => setCurrentlyRunning(false));
          }
        });
      },
      5000,
      [],
    ),
  );

  const onReload = () => {
    setIsUpdatePending(false);
    setCurrentlyRunning(false);
    updateExpoService.reload();
  };

  return {
    showNote,
    onReload,
  };
};
