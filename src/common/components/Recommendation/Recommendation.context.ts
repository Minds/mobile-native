import { createContext, useContext } from 'react';
import { GroupRecommendationStore } from './hooks/useGroupRecommendation';
import { ChannelRecommendationStore } from '../ChannelRecommendation/hooks/useChannelRecommendation';

export type RecommendationContextType =
  | {
      groupRecommendation: GroupRecommendationStore;
      channelRecommendation: ChannelRecommendationStore;
    }
  | undefined;

export const RecommendationContext =
  createContext<RecommendationContextType>(undefined);

export default function useRecommendationContext() {
  return useContext(RecommendationContext)!;
}
