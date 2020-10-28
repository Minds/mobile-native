//@ts-nocheck
import React, { PureComponent, useCallback, useRef } from 'react';

import { View, TextStyle } from 'react-native';

import CenterLoading from '../../common/components/CenteredLoading';
import type ActivityModel from 'src/newsfeed/ActivityModel';
import Selector from './Selector';
import { observer, useLocalStore } from 'mobx-react';
import ThemedStyles from '../../styles/ThemedStyles';

export interface TranslatePropsType {
  entity: ActivityModel;
  style?: TextStyle | Array<TextStyle>;
}

const Translate = observer(({ entity, style }: TranslatePropsType) => {
  const localStore = useLocalStore(createLocalStore);
  const selectorRef = useRef<Selector>(null);

  const languageSelected = useCallback((language) => {
    console.log('language', language);
    /*
      this.setState({ current: language }, async () => {
        this.hidePicker();
        await this.translate(language);
        this.selectedResolve(language);
      });*/
  }, []);

  const theme = ThemedStyles.style;

  if (!localStore.show) {
    return null;
  }

  if (localStore.translating) {
    return <CenterLoading />;
  }
  const translated = this.renderTranslated();

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
      {translated}
    </View>
  );
});

export default Translate;
