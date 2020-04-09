var express = require('express');
var router = express.Router();
const request = require('request');
const utils = require('./utils');

router.post('/', function (req, res, next) {
    const b = req.body;

    request({ url: getUrl(b), qs: getParams(b), headers: getHeaders(b), json: true }, (e, r, b) => {
        if (b && b.orion && b.orion.version) res.send(true);
        else res.send(false);
    });

    function getUrl(b) {
        return utils.parseUrl(b.cometUrl) + "/STH/v1/contextEntities/type/" + b.type + "/id/" + b.id + "/attributes/" + b.attr;
    }

    function getParams(b) {
        switch (b.operation) {
            case 'first':
                return getParamsFirst(b);
            case 'last':
                return getParamsLast(b);
            case 'aggr':
                return getParamsAggr(b);
        }
    }

    function getParamsFirst(b) {
        return {
            hLimit: b.n,
            hOffset: b.offset,
        }
    }

    function getParamsLast(b) {
        return {
            lastN: b.n,
        }
    }

    function getParamsAggr(b) {
        return {
            aggrMethod: b.aggrMethod,
            aggrPeriod: b.aggrPeriod,
        }
    }

    function getHeaders(b) {
        const headers = {};
        if (b.service) headers['fiware-service'] = b.service;
        if (b.servicePath) headers['fiware-servicepath'] = b.servicePath;
        return headers;
    }

});

module.exports = router;
