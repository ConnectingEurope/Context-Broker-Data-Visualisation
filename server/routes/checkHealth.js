var express = require('express');
var router = express.Router();
const request = require('request');

router.get('/', function (req, res, next) {

  const url = req.query.url + '/version';
  if (!url.startsWith('http://') && !url.startsWith('https://')) res.status(404).send('shit');
  else {
    request({ url: url, json: true }, (e, r, b) => {
      res.send(r);
    });
  }

});

module.exports = router;
