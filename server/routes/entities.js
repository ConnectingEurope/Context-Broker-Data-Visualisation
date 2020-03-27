var express = require('express');
var router = express.Router();
const request = require('request');

router.get('/', function (req, res, next) {

  const url = req.query.url + (req.query.port ? ':' + req.query.port : '') + '/v2/types';
  const headers = req.query.service !== undefined && req.query.servicePath !== undefined ? {
    'fiware-service': req.query.service,
    'fiware-servicepath': req.query.servicePath,
  } : {};
  console.log(headers);
  if (!url.startsWith('http://') && !url.startsWith('https://')) res.status(404).send();
  else {
    request({ url: url, headers: headers, json: true }, (e, r, b) => {
      res.send(b);
    });
  }
});

module.exports = router;
