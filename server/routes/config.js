const express = require('express');
const router = express.Router();
const Datastore = require('nedb');
const db = new Datastore({ filename: './configuration', autoload: true });

router.post('/', function (routerReq, routerRes, routerNext) {
  db.find({}, function (err, docs) {
    if (!err) {
      if (docs.length === 0) { insert(routerReq.body) }
      else { update(routerReq.body) }
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
