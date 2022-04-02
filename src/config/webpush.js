const webpush = require('web-push');

const publicVapidKey = 'BH6ZN8fGDmPTea0x9O6eMdtwS4PY69R62WO5ZfK1x7PfHrQ8oLLxEGjJ11Z8aOf8SJktIx-nHavRj5OSAlT-ALI';
const privateVapidKey = 'R_5znwWI1VeDjYkMSQyE28KR5EtOdPNLrQ19YSgg9lc';

module.exports = () => {
  webpush.setVapidDetails(
    'mailto:gkgkgkgk1195@gmail.com',
    publicVapidKey,
    privateVapidKey,
  );
};
