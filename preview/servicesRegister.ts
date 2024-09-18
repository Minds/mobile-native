import { LogService } from '~/common/services/log.service';
import { Storages } from '~/common/services/storage/storages.service';
import { Lifetime } from '~/services/injectionContainer';
import sp from '~/services/serviceProvider';
import { ThemedStyles } from '~/styles/ThemedStyles';
import PreviewUpdateService from './PreviewUpdateService';

// storages
sp.register('storages', () => new Storages(), Lifetime.Singleton);

// themed styles
sp.register(
  'styles',
  () => {
    const theme = sp.resolve('storages').app.getNumber('theme');
    return new ThemedStyles(theme as 0 | 1);
  },
  Lifetime.Singleton,
);

// log
sp.register(
  'log',
  () => {
    return new LogService();
  },
  Lifetime.Singleton,
);

// preview update service
sp.register('previewUpdate', () => {
  return new PreviewUpdateService(sp.resolve('storages'), sp.resolve('log'));
});
