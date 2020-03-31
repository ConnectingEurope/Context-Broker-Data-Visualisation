const express = require('express');
const router = express.Router();
const request = require('request');
const Datastore = require('nedb');
const utils = require('./utils');

let contextBrokers = null;

router.get('/', function (routerReq, routerRes, routerNext) {
  readConfig(routerRes);
});

function readConfig(routerRes) {

  const db = new Datastore({ filename: './configuration', autoload: true });

  db.find({}, function (err, docs) {
    if (!err && docs.length > 0) {
      contextBrokers = docs[0].contextBrokers;
      processEntities(routerRes);
    } else {
      routerRes.send([]);
    }
  });
}

async function processEntities(routerRes) {
  const modelDtos = [];
  for (const cb of contextBrokers) {
    for (const s of cb.services) {
      for (const e of s.entities) {
        let entityData = null;
        try {
          entityData = await get(cb, s);
        } catch (error) {
          routerRes.status(500).send(error);
        }
        const modelDto = getModelDto(e, entityData);
        modelDtos.push(modelDto);
      }
    }
  }
  routerRes.send(modelDtos);
}

function get(source, service) {
  return new Promise((resolve, reject) => {
    request({ url: getUrl(source), qs: getParams(), headers: getHeaders(service), json: true }, (err, res, body) => {
      if (err) { reject(err); }
      resolve(body);
    });
  });
}

function getUrl(cb) {
  return utils.parseUrl(cb.url) + "/v2/entities";
}

function getParams() {
  return {
    options: 'keyValues',
    limit: '1000'
  };
}

function getHeaders(service) {
  return {
    'fiware-service': service.service,
    'fiware-servicepath': service.servicepath,
  };
}

function getModelDto(entity, entityData) {
  return {
    type: entity.name,
    data: entityData
  }
}

module.exports = router;
