var express = require('express');
var router = express.Router();
const request = require('request');
const utils = require('./utils');

router.post('/', function (req, res, next) {
    const b = req.body;

    request({ url: getUrl(b), qs: getParams(b), headers: getHeaders(b), json: true }, (e, r, b) => {
        if (b && b.contextResponses) {
            res.send(r);
        }
        else { res.status(500).send(e) };
    });

    function getUrl(b) {
        return utils.parseUrl(b.cometUrl) + "/STH/v1/contextEntities/type/" + b.type + "/id/" + b.id + "/attributes/" + b.attr;
    }

    function getParams(b) {
        return b.operationParameters;
    }

    function getHeaders(b) {
        const headers = {};
        if (b.service) headers['fiware-service'] = b.service;
        if (b.servicePath) headers['fiware-servicepath'] = b.servicePath;
        return headers;
    }

});

module.exports = router;
