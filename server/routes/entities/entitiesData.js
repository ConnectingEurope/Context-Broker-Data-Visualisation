const express = require('express');
const router = express.Router();
const request = require('request');
const db = require('../../db.js');
const utils = require('../../utils');

const maxRequestSize = 1000;

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
            try {
                await processEntity(cb, s, e, modelDtos);
            } catch (exception) {
                if (!exception.res && !exception.err) console.log(exception);
                else if (!routerRes.headersSent) {
                    utils.sendFiwareError(routerRes, exception.res, exception.err);
                }
            }
        }
    }
}

async function processEntity(cb, s, e, modelDtos) {
    let entityData = [];
    let offset = 0;
    let totalCount = 0;
    do {
        const data = await get(cb, s, e, offset);
        totalCount = data.totalCount;
        entityData = entityData.concat(data.entityDataBlock);
        offset += maxRequestSize;
    } while (totalCount > offset);
    const modelDto = getModelDto(cb, s, e, entityData);
    modelDtos.push(modelDto);
}

function get(cb, s, e, offset) {
    return new Promise((resolve, reject) => {
        request({ url: getUrl(cb), qs: getParams(e, offset), headers: utils.getBrokerHeaders(s), json: true }, (err, res, body) => {
            if (err) { reject({ res, err }); }
            resolve({ entityDataBlock: body, totalCount: res.headers['fiware-total-count'] });
        });
    });
}

function getUrl(cb) {
    return utils.parseUrl(cb.url) + '/v2/entities';
}

function getAttrs(entity) {
    return entity.attrs.filter(a => a.selected).map(a => a.name).concat(['location']).join();
}

function getParams(e, offset) {
    return {
        type: e.name,
        options: 'keyValues,count',
        limit: maxRequestSize,
        offset: offset,
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
