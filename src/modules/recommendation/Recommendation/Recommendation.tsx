import React, { FC } from 'react';
import RecommendationBody, {
  RecommendationBodyProps,
} from './RecommendationBody';
import RecommendationHeader from './RecommendationHeader';
import RecommendationProvider from './RecommendationProvider';

const Recommendation: FC<RecommendationBodyProps> = ({
  location,
  visible = true,
  channel,
  type,
  size,
}) => {
  return visible ? (
    <RecommendationProvider
      location={location}
      types={[type]}
      channel={channel}>
      <RecommendationHeader type={type} location={location} />
      <RecommendationBody
        size={size}
        type={type}
        location={location}
        channel={channel}
      />
    </RecommendationProvider>
  ) : null;
};

export default Recommendation;
