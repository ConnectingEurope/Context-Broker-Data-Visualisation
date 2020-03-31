var express = require('express');
var router = express.Router();
const request = require('request');
const utils = require('./utils');

router.get('/', function (req, res, next) {

  const url = utils.parseUrl(req.query.url) + '/v2/types';
  const headers = req.query.service !== undefined && req.query.servicePath !== undefined ? {
    'fiware-service': req.query.service,
    'fiware-servicepath': req.query.servicePath,
  } : {};

  request({ url: url, headers: headers, json: true }, (e, r, b) => {
    if (b) {
      res.send(b);
    } else {
      res.status(404).send();
    }
  });

});

module.exports = router;
