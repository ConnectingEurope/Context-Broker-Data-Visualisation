var express = require('express');
var router = express.Router();
const request = require('request');
const utils = require('../../utils');

const maxRequestSize = 1000;

router.post('/', function (routerReq, routerRes, routerNext) {

    try {
        const b = routerReq.body;
        processEntity(routerRes, b);
    } catch (exception) {
        if (!exception.res && !exception.err) console.log(exception);
        else if (!routerRes.headersSent) {
            utils.sendFiwareError(routerRes, exception.res, exception.err);
        }
    }

    async function processEntity(routerRes, b) {
        let entityData = [];
        let offset = 0;
        let totalCount = 0;
        do {
            const data = await get(b, offset);
            totalCount = data.totalCount;
            entityData = entityData.concat(data.entityDataBlock);
            offset += maxRequestSize;
        } while (totalCount > offset);
        if (!routerRes.headersSent) { routerRes.send(entityData); }
    }

    function get(b, offset) {
        return new Promise((resolve, reject) => {
            request({ url: getUrl(b), qs: getParams(b, offset), headers: utils.getBrokerHeaders(b), json: true }, (err, res, body) => {
                if (err) { reject({ res, err }); }
                resolve({ entityDataBlock: body, totalCount: res.headers['fiware-total-count'] });
            });
        });
    }

    function getUrl(b) {
        return utils.parseUrl(b.url) + '/v2/entities';
    }

    function getParams(b, offset) {
        let attrs = ['location'];
        if (b.favAttr) attrs.push(b.favAttr);
        if (b.attrs) { attrs = attrs.concat(b.attrs) }
        return {
            type: b.type,
            limit: 1000,
            offset: offset,
            options: 'keyValues',
            attrs: attrs.join(','),
        }
    }

});

module.exports = router;
