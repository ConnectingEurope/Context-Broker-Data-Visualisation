var express = require('express');
var router = express.Router();
const request = require('request');
const utils = require('./utils');

router.post('/', function (req, res, next) {

    const b = req.body;
    request({ url: getUrl(b), headers: getHeaders(b), json: true }, (e, r, b) => {
        if (b) {
            res.send(b);
        } else {
            res.status(404).send();
        }
    });

    function getUrl(b) {
        return utils.parseUrl(b.url) + '/v2/subscriptions';
    }

    function getHeaders(b) {
        const headers = {};
        if (b.service !== undefined) headers['fiware-service'] = b.service;
        if (b.servicePathb !== undefined) headers['fiware-servicepath'] = b.servicePath;
        return headers;
    }

});

module.exports = router;