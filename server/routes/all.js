var express = require('express');
var router = express.Router();
const request = require('request');

const entities = [
  { type: 'AirQualityObserved', service: 'openiot', servicepath: '/AirQualityObserved', key: 'airQualityObserved', parentKey: 'environment' },
  { type: 'OffStreetParking', service: 'openiot', servicepath: '/OffStreetParking', key: 'offStreetParking', parentKey: 'transport' },
];

router.get('/', function (routerReq, routerRes, routerNext) {

  (async () => {
    const data = await processEntities(entities);
    routerRes.send(data);
  })()

});

async function processEntities(entities) {

  const data = [];

  for (const e of entities) {
    const d = await get(e);
    data.push(getModelDto(e, d));
  }
  return data;
}

function get(e) {

  return new Promise((resolve, reject) => {

    request({ url: 'http://localhost:1026/v2/entities', qs: getParams(e), headers: getHeaders(e), json: true }, (err, res, body) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(body);
      }
    });

  });
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

function getModelDto(entity, d) {

  return {
    key: entity.key,
    parentKey: entity.parentKey,
    data: d
  }
}

module.exports = router;
