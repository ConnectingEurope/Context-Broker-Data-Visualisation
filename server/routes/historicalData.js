var express = require('express');
var router = express.Router();
const request = require('request');
const utils = require('./utils');
const _ = require('lodash');

router.post('/raw', function (req, res, next) {
    const body = req.body;

    request({ url: getUrl(body), qs: getParams(body), headers: getHeaders(body), json: true }, (e, r, b) => {
        if (b && b.contextResponses) {
            res.send(r);
        }
        else { res.status(500).send(e) };
    });
});

router.post('/aggr', function (req, res, next) {
    const body = req.body;

    request({ url: getUrl(body), qs: getParams(body), headers: getHeaders(body), json: true }, (e, r, b) => {
        console.log(r);
        console.log(b);
        console.log(getUrl(body));
        console.log(getParams(body));
        console.log(getHeaders(body));
        if (_.get(b, 'contextResponses[0].contextElement.attributes[0].values[0].points'))
            res.send(b.contextResponses[0].contextElement.attributes[0].values[0].points);
        else res.status(404).send(b);
    });
});

function getUrl(b) {
    return utils.parseUrl(b.cometUrl) + "/STH/v1/contextEntities/type/" + b.type + "/id/" + b.id + "/attributes/" + b.attr;
}

function getParams(b) {
    return b.operationParameters;
}

function getHeaders(b) {
    const headers = {
        'fiware-service': b.service ? b.service : '/',
        'fiware-servicepath': b.servicePath ? b.servicePath : '/',
    };
    return headers;
}

router.post('/attrs', function (req, res, next) {
    const body = req.body;

    request({ url: getUrl(body), headers: getHeaders(body), json: true }, (e, r, b) => {
        if (b && b.length > 0) {
            const attrs = new Set();
            b.forEach(subscription => {
                if (subscription.subject.entities.some(e => checkIfIdMatchs(e, body.entityId))) {
                    subscription.notification.attrs.forEach(a => attrs.add(a));
                }
            });
            res.send(Array.from(attrs));
        }
        else res.send([]);
    });

    function getUrl(b) {
        return utils.parseUrl(b.contextUrl) + "/v2/subscriptions/";
    }

    function getHeaders(b) {
        const headers = {};
        if (b.service) headers['fiware-service'] = b.service;
        if (b.servicePath) headers['fiware-servicepath'] = b.servicePath;
        return headers;
    }

    function checkIfIdMatchs(entityPattern, entityId) {
        return entityPattern.id && entityPattern.id === entityId ||
            entityPattern.idPattern && (new RegExp(entityPattern.idPattern)).test(entityId);
    }

});

module.exports = router;
