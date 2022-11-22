/* eslint-disable @typescript-eslint/no-unused-vars */
const reTrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;

const EventSource = function (this: any, url, options) {
  // eslint-disable-next-line consistent-this
  const eventsource = this;
  let interval = 500; // polling interval
  let lastEventId: string | null = null;
  let lastIndexProcessed = 0;
  let eventType;

  if (!url || typeof url !== 'string') {
    throw new SyntaxError('Not enough arguments');
  }

  this.URL = url;
  this.OPTIONS = options;
  this.readyState = this.CONNECTING;
  this._pollTimer = null;
  this._xhr = null;
  this.CONNECTING = 0;
  this.OPEN = 1;
  this.CLOSED = 2;

  const pollAgain = (delay: number) => {
    this._pollTimer = setTimeout(() => {
      poll.call(this);
    }, delay);
  };

  const poll = () => {
    try {
      // force hiding of the error message... insane?
      if (this.readyState === this.CLOSED) {
        return;
      }

      // NOTE: IE7 and upwards support
      const xhr = new XMLHttpRequest();
      xhr.open(this.OPTIONS.method || 'GET', this.URL, true);
      if (this.OPTIONS && this.OPTIONS.headers) {
        Object.keys(this.OPTIONS.headers).forEach(key => {
          xhr.setRequestHeader(key, this.OPTIONS.headers[key]);
        });
      }
      xhr.setRequestHeader('Accept', 'text/event-stream');
      xhr.setRequestHeader('Cache-Control', 'no-cache');
      // we must make use of this on the server side if we're working with Android - because they don't trigger
      // readychange until the server connection is closed
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

      if (lastEventId != null) {
        xhr.setRequestHeader('Last-Event-ID', lastEventId);
      }
      lastIndexProcessed = 0;

      xhr.timeout =
        this.OPTIONS && this.OPTIONS.timeout !== undefined
          ? this.OPTIONS.timeout
          : 50000;

      xhr.onreadystatechange = function () {
        if (
          xhr.readyState === 3 ||
          (xhr.readyState === 4 && xhr.status === 200)
        ) {
          // on success
          if (eventsource.readyState === eventsource.CONNECTING) {
            eventsource.readyState = eventsource.OPEN;
            eventsource.dispatchEvent('open', { type: 'open' });
          }

          let responseText = '';
          try {
            responseText = this.responseText || '';
          } catch (e) {}

          // process this.responseText
          const parts = responseText.substring(lastIndexProcessed).split('\n');
          let data: string[] = [];
          let retry = 0;
          let line = '';
          lastIndexProcessed = responseText.lastIndexOf('\n\n') + 2;

          // TODO handle 'event' (for buffer name), retry
          for (let i = 0; i < parts.length; i++) {
            line = parts[i].replace(reTrim, '');
            if (line.indexOf('event') === 0) {
              eventType = line.replace(/event:?\s*/, '');
            } else if (line.indexOf('retry') === 0) {
              retry = parseInt(line.replace(/retry:?\s*/, ''), 10);
              if (!isNaN(retry)) {
                interval = retry;
              }
            } else if (line.indexOf('data') === 0) {
              const x = line.replace(/data:?\s*/, '');
              data.push(x);
            } else if (line.indexOf('id:') === 0) {
              lastEventId = line.replace(/id:?\s*/, '');
            } else if (line.indexOf('id') === 0) {
              // this resets the id
              lastEventId = null;
            } else if (line === '') {
              if (data.length) {
                eventsource.dispatchEvent(eventType ?? 'message', {
                  data: data.join('\n'),
                  origin: eventsource.url,
                  lastEventId,
                  type: 'message',
                });
                data = [];
                eventType = undefined;
              }
            }
          }

          if (this.readyState === 4) {
            pollAgain(interval);
          }

          // don't need to poll again, because we're long-loading
        } else if (eventsource.readyState !== eventsource.CLOSED) {
          if (this.readyState === 4) {
            // and some other status
            pollAgain(interval);
          } else if (this.readyState === 0) {
            // likely aborted
            pollAgain(interval);
          }
        }
      };

      xhr.onerror = function () {
        // dispatch error
        eventsource.readyState = eventsource.CONNECTING;

        eventsource.dispatchEvent('error', {
          type: 'error',
          message: this.responseText,
        });
      };

      if (this.OPTIONS.body) {
        xhr.send(this.OPTIONS.body);
      } else {
        xhr.send();
      }

      if (xhr.timeout > 0) {
        setTimeout(function () {
          if (true || xhr.readyState === 3) {
            xhr.abort();
          }
        }, xhr.timeout);
      }

      this._xhr = xhr;
    } catch (e: any) {
      // in an attempt to silence the errors
      this.dispatchEvent('error', { type: 'error', data: e.message }); // ???
    }
  };

  poll(); // init now
};

EventSource.prototype = {
  close: function () {
    // closes the connection - disabling the polling
    this.readyState = this.CLOSED;
    clearInterval(this._pollTimer);
    this._xhr.abort();
  },
  dispatchEvent: function (type: string, event) {
    const handlers = this['_' + type + 'Handlers'];
    if (handlers) {
      for (let i = 0; i < handlers.length; i++) {
        handlers[i].call(this, event);
      }
    }

    if (this['on' + type]) {
      this['on' + type].call(this, event);
    }
  },
  addEventListener: function (type: string, handler) {
    if (!this['_' + type + 'Handlers']) {
      this['_' + type + 'Handlers'] = [];
    }

    this['_' + type + 'Handlers'].push(handler);
  },
  removeEventListener: function (type: string, handler) {
    const handlers = this['_' + type + 'Handlers'];
    if (!handlers) {
      return;
    }
    for (let i = handlers.length - 1; i >= 0; --i) {
      if (handlers[i] === handler) {
        handlers.splice(i, 1);
        break;
      }
    }
  },
  onerror: null,
  onmessage: null,
  onopen: null,
  readyState: 0,
};

export type EventPrototype = {
  close: () => void;
  dispatchEvent: (type: string, event) => void;
  addEventListener: (type: string, handler: Listener) => void;
  removeEventListener: (type: string, handler: Listener) => void;
};

export type Listener = {
  remove: () => void;
  type: string;
  listener: unknown;
};

export default EventSource;
