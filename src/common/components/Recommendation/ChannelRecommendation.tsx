import React, { FC } from 'react';
import RecommendationBody, {
  RecommendationBodyProps,
} from './RecommendationBody';
import RecommendationHeader from './RecommendationHeader';
import RecommendationProvider from './RecommendationProvider';

const ChannelRecommendation: FC<RecommendationBodyProps> = ({
  location,
  visible = true,
  channel,
}) => {
  return visible ? (
    <RecommendationProvider
      location={location}
      types={['channel']}
      channel={channel}>
      <RecommendationHeader type="channel" location={location} />
      <RecommendationBody
        type="channel"
        location={location}
        channel={channel}
      />
    </RecommendationProvider>
  ) : null;
};

export default ChannelRecommendation;
