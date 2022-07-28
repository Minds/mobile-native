import React, { FC } from 'react';
import ChannelRecommendationBody, {
  ChannelRecommendationProps,
} from './ChannelRecommendationBody';
import ChannelRecommendationHeader from './ChannelRecommendationHeader';
import { useChannelRecommendation } from './hooks/useChannelRecommendation';

const ChannelRecommendation: FC<ChannelRecommendationProps> = ({
  location,
  visible = true,
  channel,
}) => {
  const recommendation = useChannelRecommendation(location, channel);
  return visible ? (
    <>
      <ChannelRecommendationHeader
        location={location}
        recommendationStore={recommendation}
      />
      <ChannelRecommendationBody
        location={location}
        channel={channel}
        recommendationStore={recommendation}
      />
    </>
  ) : null;
};

export default ChannelRecommendation;
