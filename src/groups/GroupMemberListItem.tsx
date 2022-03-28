import React, { useCallback } from 'react';
import ChannelListItem, {
  ChannelListItemProps,
} from '~/common/components/ChannelListItem';
import { IconButton } from '~/common/ui';

export interface GroupMemberListItemProps extends ChannelListItemProps {
  isOwner: boolean;
  isModerator: boolean;
  onMenuPress: (channel: any) => void;
}
/**
 * Group user component
 */
export default function GroupMemberListItem(props: GroupMemberListItemProps) {
  const renderRightButton = useCallback(() => {
    if (
      !(props.isOwner || props.isModerator) ||
      props.channel.isOwner() ||
      (props.isModerator && props.channel['is:owner'])
    ) {
      return null;
    }

    return (
      <IconButton
        name={'more'}
        onPress={() => props.onMenuPress(props.channel)}
      />
    );
  }, [props]);

  return <ChannelListItem {...props} renderRight={renderRightButton} />;
}
