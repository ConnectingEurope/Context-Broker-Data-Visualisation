var express = require('express');
var router = express.Router();
const request = require('request');
const utils = require('./utils');
const _ = require('lodash');

const maxPageSize = 100;

router.post('/raw', function (req, res, next) {
    const body = req.body;

    getRawData(res, body);
});

async function getRawData(res, body) {
    try {
        const historicalCount = await getHistoricalCount(body);
        console.log(historicalCount);
        transformParametersForDescendentOrder(body, historicalCount);
        const data = await getHistoricalData(body);
        res.send(data);
    } catch (error) {
        res.send();
    }
}

function transformParametersForDescendentOrder(body, historicalCount) {
    const hLimit = _.get(body, 'operationParameters.hLimit');
    const hOffset = _.get(body, 'operationParameters.hOffset');
    if (hLimit !== undefined && hOffset !== undefined) {
        body.operationParameters.hOffset = historicalCount - hLimit - hOffset;
        if (body.operationParameters.hOffset < 0) {
            body.operationParameters.hLimit = hLimit + body.operationParameters.hOffset;
            body.operationParameters.hOffset = 0;
        }
    }
}

function getHistoricalCount(body) {
    return new Promise((resolve, reject) => {
        request({ url: getUrl(body), qs: getHistoricalCountParams(body), headers: getHeaders(body), json: true }, (e, r, b) => {
            if (e) { reject(e); }
            resolve(r.headers['fiware-total-count']);
        });
    });
}

function getHistoricalCountParams(body) {
    body.operationParameters.count = true;
    return body.operationParameters;
}

function getHistoricalData(body) {
    return new Promise((resolve, reject) => {
        request({ url: getUrl(body), qs: getParams(body), headers: getHeaders(body), json: true }, (e, r, b) => {
            const dataValues = _.get(b, 'contextResponses[0].contextElement.attributes[0].values[0]');
            if (e || !dataValues) { reject(e); }
            else {
                r.body.contextResponses[0].contextElement.attributes[0].values.reverse();
                resolve(r);
            }
        });
    });
}

router.post('/aggr', function (req, res, next) {
    const body = req.body;

    request({ url: getUrl(body), qs: getParams(body), headers: getHeaders(body), json: true }, (e, r, b) => {
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


router.post('/csv', function (req, res, next) {
    const body = req.body;

    getCsvData(res, body);
});

async function getCsvData(res, body) {
    try {

        const historicalCount = await getHistoricalCount(body);
        const offset = 0;
        const data = {};
        const attrs = body.operationParameters.attr;

        while (offset < historicalCount) {

            offset += maxPageSize;
        }

        const data = await getHistoricalData(body);
        res.send(data);
    } catch (error) {
        res.send();
    }
}

module.exports = router;
