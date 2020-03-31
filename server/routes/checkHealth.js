var express = require('express');
var router = express.Router();
const request = require('request');
const utils = require('./utils');

router.get('/', function (req, res, next) {
  const url = utils.parseUrl(req.query.url) + '/version';

  request({ url: url, json: true }, (e, r, b) => {
    if (b && b.orion) res.send(true);
    else res.send(false);
  });

});

module.exports = router;
