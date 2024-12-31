import { useWindowDimensions } from 'react-native';
import sp from '~/services/serviceProvider';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React from 'react';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { IS_IOS } from '../../../config/Config';
import MText from '~/common/components/MText';
import MenuItemOption from '~/common/components/menus/MenuItemOption';
import { usePlaybackRate } from '../hooks/usePlaybackRate';

export type PlaybackSpeedPickerProps = {
  onSelected: () => void;
  bottomSheetRef?: BottomSheetMethods;
};

export const PlaybackSpeedPicker = (props: PlaybackSpeedPickerProps) => {
  const { rate, setRate } = usePlaybackRate();

  const renderItem = React.useCallback(
    (row: { item: number; index: number }): React.ReactElement => {
      return (
        <MenuItemOption
          title={row.item + 'x'}
          selected={row.item === rate}
          onPress={() => {
            setRate(row.item);
            props.onSelected();
            sp.navigation.goBack();
          }}
          mode="radio"
        />
      );
    },
    [rate],
  );

  const { height } = useWindowDimensions();

  return (
    <>
      <MText
        style={[
          sp.styles.style.textCenter,
          sp.styles.style.fontXL,
          sp.styles.style.fontBold,
          sp.styles.style.paddingBottom4x,
        ]}>
        Speed
      </MText>
      <BottomSheetFlatList
        data={[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item}-${index}`}
        style={[
          IS_IOS ? sp.styles.style.paddingBottom6x : undefined,
          { maxHeight: height * 0.8 - 100 },
        ]}
      />
    </>
  );
};
