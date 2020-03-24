var express = require('express');
var router = express.Router();
const request = require('request');

router.get('/', function (req, res, next) {

  const url = req.query.url + '/version';
  if (!url.startsWith('http://') && !url.startsWith('https://')) res.status(400).send();
  else {
    request({ url: url, json: true }, (e, r, b) => {
      if (b && b.orion) res.send(true);
      else res.send(false);
    });
  }

});

module.exports = router;
