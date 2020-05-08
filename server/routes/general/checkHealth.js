var express = require('express');
var router = express.Router();
const request = require('request');
const utils = require('../../utils');

router.get('/broker', function (routerReq, routerRes, routerNext) {

    const url = utils.parseUrl(routerReq.query.url) + '/version';

    request({ url: url, json: true }, (err, res, body) => {
        routerRes.send(!err && body && body.orion && body.orion.version);
    });

});

router.get('/cygnus', function (routerReq, routerRes, routerNext) {

    const url = utils.parseUrl(routerReq.query.url) + '/v1/version';

    request({ url: url, json: true }, (err, res, body) => {
        routerRes.send(!err && body && body.version);
    });

});

router.get('/comet', function (routerReq, routerRes, routerNext) {

    const url = utils.parseUrl(routerReq.query.url) + '/version';

    request({ url: url, json: true }, (err, res, body) => {
        routerRes.send(!err && body && body.version);
    });

});

module.exports = router;
