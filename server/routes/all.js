const express = require('express');
const router = express.Router();
const request = require('request');
const Datastore = require('nedb');
const db = new Datastore({ filename: './configuration', autoload: true });
const utils = require('./utils');

let contextBrokers = null;

router.get('/', function (routerReq, routerRes, routerNext) {
  readConfig(routerRes);
});

function readConfig(routerRes) {
  db.find({}, function (err, docs) {
    if (!err) {
      contextBrokers = docs[0].contextBrokers;
      processEntities(routerRes);
    }
  });
}

async function processEntities(routerRes) {
  const modelDtos = [];
  for (const cb of contextBrokers) {
    for (const s of cb.services) {
      for (const e of s.entities) {
        const entityData = await get(cb, s);
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
