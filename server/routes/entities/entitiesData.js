const express = require('express');
const router = express.Router();
const request = require('request');
const db = require('../../db.js');
const utils = require('../../utils');

router.get('/', function (routerReq, routerRes, routerNext) {
    readConfig(routerRes);
});

function readConfig(routerRes) {

    db.loadDatabase(function (err) {
        if (err) utils.sendDbError(routerRes, err);
        else {
            db.find({}, function (err, docs) {
                if (!err && docs.length > 0) {
                    contextBrokers = docs[0].contextBrokers;
                    processContextBrokers(routerRes);
                } else {
                    routerRes.send([]);
                }
            });
        }
    });
}

async function processContextBrokers(routerRes) {
    const modelDtos = [];
    for (const cb of contextBrokers) {
        await processEntities(routerRes, modelDtos, cb);
        for (const s of cb.services) {
            await processEntities(routerRes, modelDtos, cb, s);
        }
    }
    if (!routerRes.headersSent) { routerRes.send(modelDtos); }
}

async function processEntities(routerRes, modelDtos, cb, s) {
    const entitiesContainer = s ? s : cb;
    for (const e of entitiesContainer.entities) {
        if (e.selected) {
            let entityData = null;
            try {
                entityData = await get(cb, s, e);
                const modelDto = getModelDto(cb, s, e, entityData);
                modelDtos.push(modelDto);
            } catch (exception) {
                if (!exception.res && !exception.err) console.log(exception);
                else if (!routerRes.headersSent) {
                    utils.sendFiwareError(routerRes, exception.res, exception.err);
                }
            }

        }
    }
}

function get(cb, s, e) {
    return new Promise((resolve, reject) => {
        request({ url: getUrl(cb), qs: getParams(e), headers: utils.getBrokerHeaders(s), json: true }, (err, res, body) => {
            if (err) { reject({ res, err }); }
            resolve(body);
        });
    });
}

function getUrl(cb) {
    return utils.parseUrl(cb.url) + '/v2/entities';
}

function getAttrs(entity) {
    return entity.attrs.filter(a => a.selected).map(a => a.name).concat(['location']).join();
}

function getParams(e) {
    return {
        type: e.name,
        options: 'keyValues',
        limit: '1000',
        attrs: getAttrs(e),
    };
}

function getModelDto(cb, s, entity, entityData) {
    const favAttribute = entity.attrs.find(a => a.fav);
    return {
        type: entity.name,
        favAttr: favAttribute ? favAttribute.name : undefined,
        contextUrl: cb.url,
        cometUrl: cb.comet,
        service: s ? s.service : '',
        servicePath: s ? s.servicePath : '',
        data: entityData,
    }
}

module.exports = router;
