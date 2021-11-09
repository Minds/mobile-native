import React from 'react';
import { observer } from 'mobx-react';
import { Avatar, Column, B3 } from '~ui';
import excerpt from '../common/helpers/excerpt';
import type { PortraitBarItem } from './createPortraitStore';
import navigationService from '../navigation/NavigationService';

type PropsType = {
  item: PortraitBarItem;
  index: number;
};

/**
 * Portrait content bar items
 * @param props Props
 */
export default observer(function PortraitContentBarItem(props: PropsType) {
  const onPress = React.useCallback(() => {
    navigationService.push('PortraitViewerScreen', {
      index: props.index,
    });
  }, [props.index]);

  return (
    <Column align="centerBoth" horizontal="XS">
      <Avatar
        source={props.item.user.getAvatarSource()}
        onPress={onPress}
        border={props.item.unseen ? 'active' : 'transparent'}
        size="medium"
      />
      <B3 top="XXS">{excerpt(props.item.user.username, 10)}</B3>
    </Column>
  );
});
