var express = require('express');
var router = express.Router();
const request = require('request');
const utils = require('../../utils');

router.get('/broker', function (routerReq, routerRes, routerNext) {

    const url = utils.parseUrl(routerReq.query.url) + '/version';

    request({ url: url, json: true }, (err, res, body) => {
        routerRes.send(!err && body && body.orion && body.orion.version && true);
    });

});

router.get('/cygnus', function (routerReq, routerRes, routerNext) {

    const url = utils.parseUrl(routerReq.query.url) + '/v1/version';

    request({ url: url, json: true }, (err, res, body) => {
        routerRes.send(!err && body && body.version && true);
    });

});

router.get('/comet', function (routerReq, routerRes, routerNext) {

    const url = utils.parseUrl(routerReq.query.url) + '/version';

    request({ url: url, json: true }, (err, res, body) => {
        routerRes.send(!err && body && body.version && true);
    });

});

module.exports = router;
