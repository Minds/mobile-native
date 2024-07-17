type ServiceFactory<T> = (arg: any) => T;

export enum Lifetime {
  Singleton,
  Scoped,
}

class ServiceRegistration<T> {
  constructor(public factory: ServiceFactory<T>, public lifetime: Lifetime) {}
}

/**
 * Injection container with lazy support
 */
export class InjectionContainer<Services extends { [key: string]: any }> {
  private singletons = new Map<keyof Services, any>();
  private registrations = new Map<keyof Services, ServiceRegistration<any>>();
  private resolutionStack: Array<keyof Services> = []; // Step 1: Maintain a call stack

  register<K extends keyof Services>(
    identifier: K,
    factory: ServiceFactory<Services[K]>,
    lifetime: Lifetime = Lifetime.Singleton,
  ): void {
    console.log('DI registering', String(identifier));
    this.registrations.set(
      identifier as string,
      new ServiceRegistration<Services[K]>(factory, lifetime),
    );
  }

  resolve<K extends keyof Services>(identifier: K, arg?: any): Services[K] {
    // development circular dependency detection
    if (__DEV__) {
      if (this.resolutionStack.includes(identifier)) {
        throw new Error(
          `Circular dependency detected: ${this.resolutionStack.join(
            ' -> ',
          )} -> ${String(identifier)}`,
        );
      }
      this.resolutionStack.push(identifier);
    }

    // we first check for singletons (for performance reasons)
    const singleton = this.singletons.get(identifier as string);
    if (singleton) {
      if (__DEV__) {
        this.resolutionStack.pop();
      }
      return singleton;
    }

    const registration = this.registrations.get(identifier as string);
    if (!registration) {
      throw new Error(`Service not registered: ${identifier as string}`);
    }

    const instance = registration.factory(arg);

    if (registration.lifetime === Lifetime.Singleton) {
      this.singletons.set(identifier as string, instance);
    }

    if (__DEV__) {
      this.resolutionStack.pop();
    }
    // console.log('DI resolved', identifier);
    return instance;
  }

  /**
   * Resolves a service lazily, meaning that the service is resolved when a property is accessed.
   *
   * BE ADVISED: If the service is not a singleton it will create a new instance each time
   * a property is accessed.
   *
   * @param identifier String
   */
  resolveLazy<K extends keyof Services>(identifier: K): Services[K] {
    return new Proxy(
      {},
      {
        get: (_, prop) => {
          const service = this.resolve(identifier);
          if (service && prop in service) {
            if (typeof service[prop] === 'function') {
              return service[prop].bind(service);
            } else {
              return service[prop];
            }
          } else {
            throw new Error(
              'Property not found on service: ' + prop.toString(),
            );
          }
        },
      },
    ) as Services[K];
  }
}
