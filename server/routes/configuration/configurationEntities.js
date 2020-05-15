var express = require('express');
var router = express.Router();
const db = require('../../db.js');
const utils = require('../../utils');

router.get('/', function (routerReq, routerRes, routerNext) {

    db.loadDatabase(function (err) {
        if (err) utils.sendDbError(routerRes, err);
        else {
            db.find({}, function (err, docs) {
                if (err || docs.length === 0) routerRes.send([]);
                else processEntitiesConf(routerRes, docs[0].contextBrokers);
            });
        }
    });

});

function processEntitiesConf(routerRes, contextBrokers) {
    const entities = [];
    contextBrokers.forEach(cb => {
        addEntities(cb.entities, entities);
        cb.services.forEach((service) => addEntities(service.entities, entities));
    });
    routerRes.send(entities);
}

function addEntities(entitiesConf, entities) {
    entitiesConf.forEach((entityConf) => {
        if (entityConf.selected) {
            let existentEntity = entities.find(e => e.name == entityConf.name);
            if (!existentEntity) addNewEntity(entityConf, entities);
            else updateEntity(entityConf, existentEntity);
        }
    });
}

function addNewEntity(entityConf, entities) {
    entityConf.attrs = entityConf.attrs.filter(attr => attr.selected);
    entities.push(entityConf);
}

function updateEntity(entityConf, existentEntity) {
    entityConf.attrs.forEach((attrConf) => {
        const existentAttr = existentEntity.attrs.find(element => element.name == attrConf.name);
        if (!existentAttr && attrConf.selected) { existentEntity.attrs.push(attrConf) };
    });
}

module.exports = router;
