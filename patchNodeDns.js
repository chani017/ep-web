const dns = require('dns');
const originalLookup = dns.lookup;
dns.lookup = function(hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = { family: 4 };
  } else if (typeof options === 'object') {
    options = { ...options, family: 4 };
  } else {
    options = { family: 4 };
  }
  return originalLookup(hostname, options, callback);
};
