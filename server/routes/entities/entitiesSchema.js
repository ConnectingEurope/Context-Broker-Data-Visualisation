var express = require('express');
var router = express.Router();
const request = require('request');
const utils = require('../../utils');


router.post('/', function (routerReq, routerRes, routerNext) {

    const b = routerReq.body;

    request({ url: getUrl(b), headers: utils.getBrokerHeaders(b), json: true }, (err, res, body) => {
        if (err) utils.sendFiwareError(routerRes, res, err);
        else {
            try {
                evaluateTypes(routerRes, b, body);
            } catch (exception) {
                if (!exception.res && !exception.err) console.log(exception);
                else if (!routerRes.headersSent) {
                    utils.sendFiwareError(routerRes, exception.res, exception.err);
                }
            }
        }
    });

});

function getUrl(b) {
    return utils.parseUrl(b.url) + '/v2/types';
}

async function evaluateTypes(routerRes, requestInfo, types) {
    const typeDtos = [];
    for (const t of types) {
        typeDtos.push({
            valid: await isTypeValid(requestInfo, t),
            schema: t,
        });
    }
    if (!routerRes.headersSent) routerRes.send(typeDtos);
}

async function isTypeValid(requestInfo, t) {
    return t.attrs.location !== undefined && await getIsValidLocation(requestInfo, t);
}

function getIsValidLocation(requestInfo, t) {
    return new Promise((resolve, reject) => {
        const url = getValidationUrl(requestInfo);
        const params = getValidationParams(requestInfo, t);
        const headers = utils.getBrokerHeaders(requestInfo)
        request({ url: url, qs: params, headers: headers, json: true }, (err, res, body) => {
            if (err) reject({ res, err });
            else if (body.length > 0 && isValidLocation(body[0])) resolve(true);
            else resolve(false);
        });
    });
}

function isValidLocation(attrs) {
    return attrs.length > 0 && attrs[0].type === 'Point';
}

function getValidationUrl(requestInfo) {
    return utils.parseUrl(requestInfo.url) + '/v2/entities';
}

function getValidationParams(requestInfo, t) {
    return {
        type: t.type,
        limit: 1,
        attrs: 'location',
        options: 'values'
    }
}

module.exports = router;
