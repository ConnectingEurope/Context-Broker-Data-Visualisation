var express = require('express');
var router = express.Router();
const request = require('request');

const params = {
  type: 'EEA_POLLUTION',
  options: 'keyValues',
  limit: '1000'
};

const heads = {
  'fiware-service': 'openiot',
  'fiware-servicepath': '/EEA_POLLUTION',
};

router.get('/', function (req, res, next) {

  request({ url: 'http://localhost:1026/v2/entities', qs: params, headers: heads, json: true }, (e, r, b) => {
    if (e) { return console.log(e); }
    res.send(b);
  });

});

module.exports = router;
