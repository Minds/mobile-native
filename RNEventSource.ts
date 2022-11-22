import EventSource, { EventPrototype, Listener } from './EventSource';

class RNEventSource {
  url: string;
  options: unknown;
  eventSource: typeof EventSource & EventPrototype;
  listeners: Listener[];

  constructor(url: string, options = {}) {
    this.url = url;
    this.options = options;
    this.eventSource = new EventSource(url, options);
    this.listeners = [];
  }

  addEventListener(type: string, listener: Listener) {
    this.eventSource.addEventListener(type, listener);

    const remove = () => {
      this.removeListener(type, listener);
    };

    this.listeners.push({
      remove,
      type,
      listener,
    });

    return this.listeners[this.listeners.length - 1];
  }

  removeAllListeners() {
    this.listeners.map(listener => {
      listener.remove();
    });
  }

  removeListener(type: string, listener: Listener) {
    this.eventSource.removeEventListener(type, listener);
  }

  close() {
    this.eventSource.close();
  }
}

export default RNEventSource;
