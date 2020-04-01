const express = require('express');
const router = express.Router();
const Datastore = require('nedb');
let db;

router.get('/', function (routerReq, routerRes, routerNext) {
  db = new Datastore({ filename: './configuration', autoload: true });
  db.find({}, function (err, docs) {
    if (!err) {
      if (docs.length === 0) { routerRes.send([]); }
      else {
        routerRes.send(docs[0].contextBrokers);
      }
    }
  });
});

router.post('/', function (routerReq, routerRes, routerNext) {
  db = new Datastore({ filename: './configuration', autoload: true });
  db.find({}, function (err, docs) {
    if (!err) {
      let config = { contextBrokers: routerReq.body };
      if (docs.length === 0) { insert(config) }
      else { update(config) }
    }
  });
  routerRes.send();
});

function insert(config) {
  db.insert(config, function (err, newDoc) {
  });
}

function update(config) {
  db.update({}, config, {}, function (err, numReplaced) {
  });
}

module.exports = router;
