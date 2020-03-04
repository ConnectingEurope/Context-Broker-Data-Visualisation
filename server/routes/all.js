const importFresh = require('import-fresh');
const express = require('express');
const router = express.Router();
const request = require('request');
let config = importFresh('config').get('config');

const sources = config.sources;

router.get('/', function (routerReq, routerRes, routerNext) {

  (async () => {
    const modelDtos = await processEntities();
    routerRes.send(modelDtos);
  })()

});

async function processEntities() {

  const modelDtos = [];

  for (const s of sources) {

    for (const e of s.entities) {
      const entityData = await get(s, e);
      const modelDto = getModelDto(e, entityData);
      modelDtos.push(modelDto);
    }

  }

  return modelDtos;
}

function get(source, entity) {

  return new Promise((resolve, reject) => {

    request({ url: getUrl(source), qs: getParams(entity), headers: getHeaders(entity), json: true }, (err, res, body) => {
      if (err) { reject(err); }
      resolve(body);
    });

  });

}

function getUrl(source) {
  return source.contextBrokerUrl + ":" + source.contextBrokerPort + "/" + source.apiVersion + "/entities";
}

function getParams(entity) {
  return {
    type: entity.type,
    options: 'keyValues',
    limit: '1000'
  };
}

function getHeaders(entity) {
  return {
    'fiware-service': entity.service,
    'fiware-servicepath': entity.servicepath,
  };
}

function getModelDto(entity, entityData) {
  return {
    type: entity.type,
    data: entityData
  }
}

module.exports = router;
