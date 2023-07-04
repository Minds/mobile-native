import React, { createContext } from 'react';
import type UserModel from '~/channel/UserModel';
import {
  ChannelRecommendationStore,
  useChannelRecommendation,
} from './hooks/useChannelRecommendation';

export type ChannelRecommendationContextType =
  | ChannelRecommendationStore
  | undefined;

export const ChannelRecommendationContext =
  createContext<ChannelRecommendationContextType>(undefined);

type ProviderPropTypes = {
  children: React.ReactNode;
  location: string;
  channel?: UserModel;
};

export const ChannelRecommendationProvider = ({
  children,
  location,
  channel,
}: ProviderPropTypes) => {
  const channelRecommendations = useChannelRecommendation(location, channel);
  return (
    <ChannelRecommendationContext.Provider value={channelRecommendations}>
      {children}
    </ChannelRecommendationContext.Provider>
  );
};
