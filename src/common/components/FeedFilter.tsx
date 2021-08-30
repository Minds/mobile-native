import React from 'react';
import { Text, TouchableOpacity, ViewStyle } from 'react-native';
import i18n from '../services/i18n.service';
import ThemedStyles, { useStyle } from '../../styles/ThemedStyles';
import MdIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { observer } from 'mobx-react';
import BottomSheet from './bottom-sheet/BottomSheet';
import BottomSheetButton from './bottom-sheet/BottomSheetButton';
import RadioButton from './bottom-sheet/RadioButton';

type PropsType = {
  hideLabel?: boolean;
  store: {
    filter: string;
    setFilter: Function;
  };
  containerStyles?: ViewStyle | ViewStyle[];
};

/**
 * Feed Filter selector
 */
const FeedFilter = (props: PropsType) => {
  const ref = React.useRef<any>();
  const close = React.useCallback(() => {
    ref.current?.dismiss();
  }, [ref]);
  const show = React.useCallback(() => {
    ref.current?.present();
  }, [ref]);
  const iconStyle = useStyle('colorIcon', { top: -1 });

  const options = React.useMemo(
    () =>
      ['all', 'images', 'videos', 'blogs'].map(f => ({
        title: i18n.t(`discovery.${f}`),
        onPress: () => {
          close();
          setTimeout(() => {
            if (props.store && props.store.setFilter) {
              props.store.setFilter(f);
            }
          }, 200);
        },
        selected: props.store.filter === f,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [close, props.store, props.store.filter],
  );

  const containerStyle = useStyle(
    'rowJustifyEnd',
    props.containerStyles as ViewStyle,
  );

  return (
    <>
      <TouchableOpacity
        style={containerStyle}
        onPress={show}
        testID="FilterToggle">
        <MdIcon name="filter-variant" size={18} style={iconStyle} />
        {!props.hideLabel && <Text style={itemStyle}>{i18n.t('filter')}</Text>}
      </TouchableOpacity>
      <BottomSheet ref={ref} title={i18n.t('filter') + ' ' + i18n.t('feed')}>
        {options.map((b, i) => (
          <RadioButton {...b} key={i} />
        ))}
        <BottomSheetButton text={i18n.t('close')} onPress={close} />
      </BottomSheet>
    </>
  );
};

const itemStyle = ThemedStyles.combine('fontM', 'paddingLeft');

export default observer(FeedFilter);
