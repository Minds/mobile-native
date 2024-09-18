import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { View } from 'react-native';

import Tags from '../Tags';
import { TranslateStoreType } from './createTranslateStore';
import { TranslatePropsType } from './Translate';
import sp from '~/services/serviceProvider';

interface PropsType extends TranslatePropsType {
  translateStore: TranslateStoreType;
}

const Translated = observer(({ translateStore, style }: PropsType) => {
  const navigation = useNavigation();
  const tagProps = {
    style,
    navigation,
  };
  const mappingCallback = useCallback(
    (v: string) =>
      !!v && (
        <Tags key={v} {...tagProps}>
          {v}
        </Tags>
      ),
    [tagProps],
  );

  if (!translateStore.translated) {
    return null;
  }

  const theme = sp.styles.style;

  const data = translateStore.getDataFromTranslation();

  return (
    <View>
      <View
        style={[
          theme.paddingLeft2x,
          theme.marginTop2x,
          theme.borderLeft2x,
          theme.bcolorPrimaryBorder,
        ]}>
        {data.map(mappingCallback)}
      </View>
    </View>
  );
});

export default Translated;
