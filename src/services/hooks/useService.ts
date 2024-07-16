import { useRef } from 'react';
import serviceProvider, { ServiceName, Services } from '../serviceProvider';

/**
 * Returns a service instance by name
 *
 * For scoped services it returns always the same instance for the component
 */
export function useService<T extends ServiceName>(service: T) {
  const ref = useRef<Services[T]>();
  if (!ref.current) {
    ref.current = serviceProvider.resolve(service) as Services[T];
  }
  return ref.current as Services[T];
}
