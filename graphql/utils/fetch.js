import rp from 'request-promise';
import DataLoader from 'dataloader';

function mergeOptions(opts) {
  const headers = Object.assign({}, opts.headers || {});
  const options = Object.assign({}, {
    json: true,
    resolveWithFullResponse: true
  }, opts);

  options.headers = headers;

  return options;
}

export function fetch(urls, options={}) {
  options = mergeOptions(options);

  const promises = urls.map((url = '') => {
    if (options.baseURI) {
      url = baseURI + url;
    }

    return new Promise((resolve, reject) => {
      const mergedOptions = Object.assign({}, options, {
        uri: url
      });

      rp(mergedOptions)
      .then((response) => {
        console.log('SUCCESS\n', mergedOptions, '\n', response.body);
        resolve(response.body)
      })
      .catch((err) => {
        console.error('ERROR\n', mergedOptions, '\n', err);
        reject(err)
      })

    })
  });

  return Promise.all(promises);
};

export function fetchWithAuth(authToken, options) {
  return function(urls) {
    options.headers = Object.assign({}, options.headers || {}, {
      Cookie: authToken
    });

    return fetch(urls, options);
  }
}
