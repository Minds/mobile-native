import { ApiResponse } from './ApiResponse';
import type { ApiService } from './api.service';
import { SupportTiersType } from '../../wire/WireTypes';
import { Platform } from 'react-native';
import useApiFetch from '../hooks/useApiFetch';

interface SupportTiersResponse extends ApiResponse {
  support_tier?: SupportTiersType;
  support_tiers?: SupportTiersType[];
}

export class SupportTiersService {
  endpoint = 'api/v3/wire/supporttiers';

  constructor(private api: ApiService) {}

  async getSingle(urn: string): Promise<SupportTiersType | undefined> {
    const response = <SupportTiersResponse>(
      await this.api.get(`${this.endpoint}/${urn}`)
    );
    return response.support_tier;
  }

  async getAllFromGuid(guid: string): Promise<SupportTiersType[] | undefined> {
    const response = <SupportTiersResponse>(
      await this.api.get(`${this.endpoint}/all/${guid}`)
    );
    // only show tiers with tokens on iOS
    if (response.support_tiers && Platform.OS === 'ios') {
      return response.support_tiers.filter(t => t.has_tokens);
    }
    return response.support_tiers;
  }

  async getAllFromUser(): Promise<SupportTiersType[] | undefined> {
    const response = <SupportTiersResponse>(
      await this.api.get(`${this.endpoint}/`)
    );
    return response.support_tiers;
  }

  async createPublic(
    name: string,
    usd: string,
    description: string,
    has_usd: boolean,
    has_tokens: boolean,
  ): Promise<SupportTiersType | undefined> {
    const response = <SupportTiersResponse>await this.api.post(
      `${this.endpoint}/`,
      {
        name,
        usd,
        description,
        has_usd,
        has_tokens,
      },
    );
    return response.support_tier;
  }

  async createPrivate(
    usd: string,
    has_usd: boolean,
    has_tokens: boolean,
  ): Promise<SupportTiersType | undefined> {
    const response = <SupportTiersResponse>await this.api.post(
      `${this.endpoint}/custom`,
      {
        usd,
        has_usd,
        has_tokens,
      },
    );
    return response.support_tier;
  }

  async update(
    urn: string,
    name: string,
    description: string,
  ): Promise<SupportTiersType | undefined> {
    const response = <SupportTiersResponse>await this.api.post(
      `${this.endpoint}/${encodeURIComponent(urn)}`,
      {
        name,
        description,
      },
    );
    return response.support_tier;
  }

  async delete(urn: string): Promise<'success' | 'error'> {
    const response = <SupportTiersResponse>(
      await this.api.delete(`${this.endpoint}/${encodeURIComponent(urn)}`)
    );
    return response.status;
  }
}

export const useSupportTiers = (skip?: boolean) => {
  const store = useApiFetch<SupportTiersResponse>('api/v3/wire/supporttiers', {
    persist: true,
    skip,
  });

  return {
    ...store,
    supportTiers: store.result?.support_tiers || [],
  };
};
