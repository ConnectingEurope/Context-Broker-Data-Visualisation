const express = require('express');
const router = express.Router();
const request = require('request');
const Datastore = require('nedb');
const utils = require('./utils');

router.get('/', function (routerReq, routerRes, routerNext) {
    readConfig(routerRes);
});

function readConfig(routerRes) {

    const db = new Datastore({ filename: './configuration.json' });
    db.loadDatabase(function (err) {
        if (err) console.log(err);
    });

    db.find({}, function (err, docs) {
        if (!err && docs.length > 0) {
            contextBrokers = docs[0].contextBrokers;
            processContextBrokers(routerRes);
        } else {
            routerRes.send([]);
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
    if (!routerRes.headersSent) {
        routerRes.send(modelDtos);
    }
}

async function processEntities(routerRes, modelDtos, cb, s) {
    const entitiesContainer = s ? s : cb;
    for (const e of entitiesContainer.entities) {
        if (e.selected) {
            let entityData = null;
            try {
                entityData = await get(cb, s, e);
            } catch (error) {
                routerRes.status(500).send(error);
            }
            const modelDto = getModelDto(cb, s, e, entityData);
            modelDtos.push(modelDto);
        }
    }
}

function get(cb, service, entity) {
    return new Promise((resolve, reject) => {
        request({ url: getUrl(cb, entity), qs: getParams(), headers: getHeaders(service), json: true }, (err, res, body) => {
            if (err) { reject(err); }
            resolve(body);
        });
    });
}

function getUrl(cb, entity) {
    const url = utils.parseUrl(cb.url) + "/v2/entities?type=" + entity.name + "&options=keyValues&attrs=" + getAttrs(entity);
    return utils.parseUrl(cb.url) + "/v2/entities?type=" + entity.name + "&options=keyValues&attrs=" + getAttrs(entity);
}

function getAttrs(entity) {
    return entity.attrs.filter(a => a.selected).map(a => a.name).concat(['location']).join();
}

function getParams() {
    return {
        options: 'keyValues',
        limit: '1000'
    };
}

function getHeaders(service) {
    if (!service) return {};
    return {
        'fiware-service': service.service,
        'fiware-servicepath': service.servicepath,
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
