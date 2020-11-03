import React, { useCallback, useEffect, useRef } from 'react';

import { View, TextStyle, Alert } from 'react-native';

import CenterLoading from '../../common/components/CenteredLoading';
import type ActivityModel from 'src/newsfeed/ActivityModel';
import Selector from './Selector';
import { observer, useLocalStore } from 'mobx-react';
import ThemedStyles from '../../styles/ThemedStyles';
import createTranslateStore from './createTranslateStore';
import Translated from './Translated';
import translationService from '../../services/translation.service';
import i18n from '../../services/i18n.service';

export interface TranslatePropsType {
  entity: ActivityModel;
  style?: TextStyle | Array<TextStyle>;
}

const Translate = observer((props: TranslatePropsType) => {
  let selectedResolve;
  const selectorRef = useRef<Selector>(null);
  const localStore = useLocalStore(createTranslateStore, { selectorRef });

  const showError = useCallback(() => {
    Alert.alert(
      i18n.t('ops'),
      i18n.t('translate.error') + '\n' + i18n.t('pleaseTryAgain'),
    );
  }, []);

  const translate = useCallback(
    async (language) => {
      let translatedFrom = null;
      try {
        const translation = await translationService.translate(
          props.entity.guid,
          language,
        );
        for (let field in translation) {
          if (localStore.translatedFrom === null && translation[field].source) {
            translatedFrom = await translationService.getLanguageName(
              translation[field].source,
            );
          }
        }
        localStore.finishTranslation(translation, translatedFrom);
      } catch (e) {
        localStore.setTranslating(false);
        showError();
      }
    },
    [localStore, props.entity.guid, showError],
  );

  const languageSelected = useCallback(
    (language) => {
      localStore.setCurrentAndTranslate(language);
    },
    [localStore],
  );

  const showPicker = async () => {
    const languages = await translationService.getLanguages();

    const current =
      localStore.current || i18n.getCurrentLocale() || languages[0].language;

    const selectPromise = new Promise((resolve, reject) => {
      selectedResolve = resolve;
    });

    localStore.setLanguagesAndCurrent(languages, current);

    return await selectPromise;
  };

  const show = useCallback(async () => {
    const lang = await translationService.getUserDefaultLanguage();

    localStore.setShow(true);

    if (!lang) {
      localStore.showPicker();
    } else {
      localStore.isTranslating();
      translate(lang);
      return lang;
    }
  }, [localStore, translate]);

  useEffect(() => {
    const shouldTranslate = async () => {
      if (localStore.current && localStore.shouldTranslate) {
        await translate(localStore.current);
        selectedResolve(localStore.current);
      }
    };
    shouldTranslate();
  }, [localStore, selectedResolve, translate]);

  const theme = ThemedStyles.style;

  if (!localStore.show) {
    return null;
  }

  if (localStore.translating) {
    return <CenterLoading />;
  }

  return (
    <View>
      <Selector
        ref={selectorRef}
        onItemSelect={languageSelected}
        title={''}
        data={localStore.languages}
        valueExtractor={(item) => item.name}
        keyExtractor={(item) => item.value}
      />
      <Translated translateStore={localStore} {...props} />
    </View>
  );
});

export default Translate;
