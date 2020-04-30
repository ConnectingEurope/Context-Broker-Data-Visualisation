var express = require('express');
var router = express.Router();
const request = require('request');
const utils = require('./utils');

router.post('/', function (req, res, next) {

    const b = req.body;
    console.log('aaaa');
    request({ url: getUrl(b), qs: getParams(b), headers: getHeaders(b), json: true }, (e, r, b) => {
        console.log(r);
        if (b) {
            res.send(b);
        } else {
            res.status(404).send();
        }
    });

    function getUrl(b) {
        return utils.parseUrl(b.url) + '/v2/entities';
    }

    function getParams(b) {
        return {
            type: b.type,
            id: b.id,
        }
    }

    function getHeaders(b) {
        const headers = {};
        if (b.service !== undefined) headers['fiware-service'] = b.service;
        if (b.servicePathb !== undefined) headers['fiware-servicepath'] = b.servicePath;
        return headers;
    }

});

module.exports = router;
