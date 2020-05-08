var express = require('express');
var router = express.Router();
const request = require('request');
const utils = require('../utils');


router.get('/', function (routerReq, routerRes, routerNext) {

    const b = routerReq.body;

    request({ url: getUrl(b), headers: utils.getHeaders(headers), json: true }, (err, res, body) => {
        if (err) utils.sendFiwareError(routerRes, res, err);
        else routerRes.send(body);
    });

    function getUrl(b) {
        return utils.parseUrl(b.url) + '/v2/types';
    }

});

module.exports = router;
