import React from 'react';

import SmallCircleButton from '~/common/components/SmallCircleButton';
import {
  PostSubscriptionFrequencyEnum,
  useGetPostSubscriptionQuery,
  useUpdatePostSubscriptionsMutation,
} from '~/graphql/api';

export default function PostSubscription({
  guid,
  raised,
  color,
  reverseColor,
  iconStyle,
}) {
  const postSubscription = useGetPostSubscriptionQuery(
    {
      entityGuid: guid,
    },
    { staleTime: 0, cacheTime: 0 },
  );

  const postMutation = useUpdatePostSubscriptionsMutation();

  const value =
    postSubscription.data?.postSubscription.frequency !==
    PostSubscriptionFrequencyEnum.Never;

  const onPress = () => {
    postMutation.mutate(
      {
        entityGuid: guid,
        frequency: value
          ? PostSubscriptionFrequencyEnum.Never
          : PostSubscriptionFrequencyEnum.Always,
      },
      {
        onSuccess: () => {
          postSubscription.refetch();
        },
      },
    );
  };

  return (
    <SmallCircleButton
      raised={raised}
      testID="post-subscription-button"
      name={
        postSubscription.isLoading
          ? 'bell-outline'
          : value
          ? 'bell-ring-outline'
          : 'bell-plus-outline'
      }
      onPress={onPress}
      disabled={postSubscription.isLoading || postMutation.isLoading}
      color={color}
      reverseColor={reverseColor}
      iconStyle={iconStyle}
    />
  );
}
