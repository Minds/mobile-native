//@ts-nocheck
/**
 * Abortable fetch
 * based on https://github.com/apentle/react-native-cancelable-fetch/blob/master/index.js
 */

interface TaggedRequest {
  tag: any;
}

export class Abort extends Error {
  code: string;
  constructor(...args) {
    super(...args);
    this.code = 'Abort';
  }
}

const _xhrs: Array<any> = [];

function remove(xhr) {
  if (xhr.tag !== undefined) {
    const i = _xhrs.indexOf(xhr);
    /* istanbul ignore else  */
    if (i !== -1) {
      _xhrs.splice(i, 1);
    }
  }
}

function headers(xhr) {
  const head = new Headers();
  const pairs = xhr.getAllResponseHeaders().trim().split('\n');
  pairs.forEach(function (header) {
    const split = header.trim().split(':');
    const key = split.shift().trim();
    const value = split.join(':').trim();
    head.append(key, value);
  });
  return head;
}

// Fetch
export default function (input, init, tag = undefined) {
  return new Promise(function (resolve, reject) {
    let request;
    if (Request.prototype.isPrototypeOf(input) && !init) {
      request = input;
    } else {
      request = new Request(input, init);
    }

    const xhr = new XMLHttpRequest() as XMLHttpRequest;

    if (init && init.timeout) {
      xhr.timeout = init.timeout;
    }

    if (tag !== undefined) {
      xhr.tag = tag;
      _xhrs.push(xhr);
    }

    function responseURL() {
      if ('responseURL' in xhr) {
        return xhr.responseURL;
      }

      // Avoid security warnings on getResponseHeader when not allowed by CORS
      //@ts-ignore
      if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
        //@ts-ignore
        return xhr.getResponseHeader('X-Request-URL');
      }

      return;
    }

    xhr.ontimeout = function () {
      reject(new TypeError('Network request failed'));
    };

    xhr.onload = function () {
      const status = xhr.status === 1223 ? 204 : xhr.status;

      if (status < 100 || status > 599) {
        remove(xhr);
        reject(new TypeError('Network request failed'));
        return;
      }

      const options = {
        status: status,
        statusText: xhr.statusText,
        headers: headers(xhr),
        url: responseURL(),
      };
      //@ts-ignore
      const body = 'response' in xhr ? xhr.response : xhr.responseText;
      remove(xhr);
      resolve(new Response(body, options));
    };

    xhr.onerror = function () {
      remove(xhr);
      reject(new TypeError('Network request failed'));
    };

    xhr.open(request.method, request.url, true);

    xhr.onabort = () => {
      reject(new Abort());
    };

    if (request.credentials === 'include') {
      xhr.withCredentials = true;
    }

    /* istanbul ignore else  */
    if ('responseType' in xhr && typeof Request.prototype.blob === 'function') {
      xhr.responseType = 'blob';
    }

    request.headers.forEach(function (value, name) {
      xhr.setRequestHeader(name, value);
    });

    xhr.send(
      typeof request._bodyInit === 'undefined' ? null : request._bodyInit,
    );
  });
}

export const abort = function (tag) {
  for (var i = _xhrs.length - 1; i > -1; i--) {
    var xhr = _xhrs[i];
    if (xhr.tag === tag) {
      _xhrs.splice(i, 1);
      clearTimeout(xhr.timer);
      xhr.abort();
    }
  }
};

export const isNetworkFail = function (err) {
  return err instanceof TypeError && err.message === 'Network request failed';
};

export const isAbort = function (err) {
  return err instanceof Abort;
};
