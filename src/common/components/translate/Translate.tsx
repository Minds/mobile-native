import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
} from 'react';
import { Icon } from 'react-native-elements';
import { View, TextStyle } from 'react-native';
import { observer, useLocalStore } from 'mobx-react';

import createTranslateStore from './createTranslateStore';
import Translated from './Translated';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import CenteredLoading from '../CenteredLoading';
import SelectorV2 from '../SelectorV2';
import { B2 } from '~/common/ui';

import sp from '~/services/serviceProvider';

export interface TranslatePropsType {
  entity: ActivityModel;
  style?: TextStyle | Array<TextStyle>;
}

const Translate = observer(
  forwardRef((props: TranslatePropsType, ref) => {
    const translationService = sp.resolve('translation');
    const localStore = useLocalStore(createTranslateStore);
    const i18n = sp.i18n;
    const languageSelected = useCallback(
      ({ language }) => {
        localStore.setCurrent(language);
        localStore.isTranslating();
        localStore.translate(language, props.entity.guid);
      },
      [localStore, props.entity.guid],
    );

    const show = useCallback(async () => {
      const lang = await translationService.getUserDefaultLanguage();

      localStore.setShow(true);

      if (lang) {
        localStore.isTranslating();
        localStore.translate(lang, props.entity.guid);
        return lang;
      }
    }, [localStore, props.entity.guid, translationService]);

    /**
     * Imperative functionality of the component
     */
    useImperativeHandle(ref, () => ({
      show: show,
    }));

    useEffect(() => {
      const shouldTranslate = async () => {
        const languages = await translationService.getLanguages();

        const current =
          localStore.current ||
          i18n.getCurrentLocale() ||
          languages[0].language;

        localStore.setLanguagesAndCurrent(languages, current);
        if (localStore.current && localStore.shouldTranslate) {
          localStore.translate(localStore.current, props.entity.guid);
        }
      };
      shouldTranslate();
    }, [i18n, localStore, props.entity.guid, translationService]);

    return (
      <View>
        {localStore.translating && <CenteredLoading />}
        {localStore.show && !localStore.translating && (
          <>
            <Translated translateStore={localStore} {...props} />
            {localStore.languages && (
              <SelectorV2
                onItemSelect={languageSelected}
                data={localStore.languages}
                valueExtractor={item => item.name}
                keyExtractor={item => item.language}>
                {show => (
                  <View style={translationBarStyle}>
                    <Icon
                      name="md-globe"
                      type="ionicon"
                      style={sp.styles.style.paddingRight1x}
                      color={sp.styles.getColor('PrimaryText')}
                      size={14}
                    />
                    <B2 color="secondary" onPress={() => show()}>
                      {i18n.t('translate.from')}{' '}
                      <B2 font="bold">
                        {localStore.translatedFrom}
                        {'  '}·{'  '}
                        {i18n.t('translate.changeLanguage')}
                      </B2>
                    </B2>
                  </View>
                )}
              </SelectorV2>
            )}
          </>
        )}
      </View>
    );
  }),
);

export default Translate;

const translationBarStyle = sp.styles.combine(
  'rowJustifyStart',
  'alignCenter',
  'marginTop3x',
);
