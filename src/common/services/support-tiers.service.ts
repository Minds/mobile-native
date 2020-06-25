import api, { ApiResponse } from './api.service';
import { SupportTiersType } from '../../wire/WireTypes';

interface SupportTiersResponse extends ApiResponse {
  support_tier?: SupportTiersType;
  support_tiers?: SupportTiersType[];
}

class SupportTiersService {
  endpoint = 'api/v3/wire/supporttiers';

  async getSingle(urn: string): Promise<SupportTiersType | undefined> {
    const response = <SupportTiersResponse>(
      await api.get(`${this.endpoint}/${urn}`)
    );
    return response.support_tier;
  }

  async getAllFromGuid(guid: string): Promise<SupportTiersType[] | undefined> {
    const response = <SupportTiersResponse>(
      await api.get(`${this.endpoint}/all/${guid}`)
    );
    return response.support_tiers;
  }

  async getAllFromUser(): Promise<SupportTiersType[] | undefined> {
    const response = <SupportTiersResponse>await api.get(`${this.endpoint}/`);
    return response.support_tiers;
  }

  async createPublic(
    name: string,
    usd: string,
    description: string,
    has_usd: boolean,
    has_tokens: boolean,
  ): Promise<SupportTiersType | undefined> {
    const response = <SupportTiersResponse>await api.post(`${this.endpoint}/`, {
      name,
      usd,
      description,
      has_usd,
      has_tokens,
    });
    return response.support_tier;
  }

  async createPrivate(
    usd: string,
    has_usd: boolean,
    has_tokens: boolean,
  ): Promise<SupportTiersType | undefined> {
    const response = <SupportTiersResponse>await api.post(
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
    const response = <SupportTiersResponse>await api.post(
      `${this.endpoint}/${urn}`,
      {
        name,
        description,
      },
    );
    return response.support_tier;
  }

  async delete(urn: string): Promise<'success' | 'error'> {
    const response = <SupportTiersResponse>(
      await api.delete(`${this.endpoint}/${urn}`)
    );
    return response.status;
  }
}

export default new SupportTiersService();
