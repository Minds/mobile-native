import { useEffect } from 'react';
import pushService from '../services/push.service';

export default function usePushNotificationListener(callback) {
  useEffect(() => {
    pushService.registerOnNotificationReceived(callback);
    return () => pushService.unregisterOnNotificationReceived(callback);
  }, [callback]);
}
