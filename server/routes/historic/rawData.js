var express = require('express');
var router = express.Router();
const request = require('request');
const lodash = require('lodash');
const utils = require('../../utils');

router.post('/', function (routerReq, routerRes, routerNext) {
    const b = routerReq.body;
    getRawData(routerRes, b);
});

async function getRawData(routerRes, b) {
    try {
        const historicalCount = await getHistoricalCount(b);
        transformParametersForDescendentOrder(b, historicalCount);
        const data = await getHistoricalData(b);
        routerRes.send(data);
    } catch (exception) {
        if (!exception.res && !exception.err) utils.sendGenericError(routerRes, exception);
        else utils.sendFiwareError(routerRes, exception.res, exception.err);
    }
}

function getHistoricalCount(b) {
    return new Promise((resolve, reject) => {
        request({ url: utils.getCometUrl(b), qs: getHistoricalCountParams(b), headers: utils.getCometHeaders(b), json: true }, (err, res, body) => {
            if (err) { reject({ res, err }); }
            resolve(res.headers['fiware-total-count']);
        });
    });
}

function getHistoricalCountParams(b) {
    b.operationParameters.count = true;
    return b.operationParameters;
}

function transformParametersForDescendentOrder(b, historicalCount) {
    const hLimit = lodash.get(b, 'operationParameters.hLimit');
    const hOffset = lodash.get(b, 'operationParameters.hOffset');
    if (hLimit !== undefined && hOffset !== undefined) {
        b.operationParameters.hOffset = historicalCount - hLimit - hOffset;
        if (b.operationParameters.hOffset < 0) {
            b.operationParameters.hLimit = hLimit + b.operationParameters.hOffset;
            b.operationParameters.hOffset = 0;
        }
    }
}

function getHistoricalData(b) {
    return new Promise((resolve, reject) => {
        request({ url: utils.getCometUrl(b), qs: utils.getCometParams(b), headers: utils.getCometHeaders(b), json: true }, (err, res, body) => {
            if (err) { reject({ res, err }); }
            else {
                if (lodash.get(body, 'contextResponses[0].contextElement.attributes[0].values')) {
                    res.body.contextResponses[0].contextElement.attributes[0].values.reverse();
                    resolve(res);
                }
                else resolve([]);
            }
        });
    });
}

module.exports = router;
