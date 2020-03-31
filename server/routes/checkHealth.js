var express = require('express');
var router = express.Router();
const request = require('request');
const utils = require('./utils');

router.get('/broker', function (req, res, next) {
  const url = utils.parseUrl(req.query.url) + '/version';

  request({ url: url, json: true }, (e, r, b) => {
    if (b && b.orion && b.orion.version) res.send(true);
    else res.send(false);
  });

});

router.get('/cygnus', function (req, res, next) {
  const url = utils.parseUrl(req.query.url) + '/v1/version';

  request({ url: url, json: true }, (e, r, b) => {
    if (b && b.version) res.send(true);
    else res.send(false);
  });

});

router.get('/comet', function (req, res, next) {
  const url = utils.parseUrl(req.query.url) + '/version';

  request({ url: url, json: true }, (e, r, b) => {
    if (b && b.version) res.send(true);
    else res.send(false);
  });

});

module.exports = router;
