import React from 'react';
import MetadataService, {
  MetadataCampaign,
  MetadataMedium,
  MetadataSource,
} from '~/common/services/metadata.service';

export function useMetadataService(
  metadataSource?: MetadataSource,
  metadataMedium?: MetadataMedium,
  metadataCampaign?: MetadataCampaign,
) {
  const service = React.useRef<MetadataService | null>(null);

  if (!service.current) {
    service.current = new MetadataService();
    if (metadataSource) {
      service.current.setSource(metadataSource);
    }
    if (metadataMedium) {
      service.current.setMedium(metadataMedium);
    }
    if (metadataCampaign) {
      service.current.setCampaign(metadataCampaign);
    }
  }

  return service.current;
}
