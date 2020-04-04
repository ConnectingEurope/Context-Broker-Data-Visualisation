const express = require('express');
const router = express.Router();
const Datastore = require('nedb');

router.get('/', function (routerReq, routerRes, routerNext) {
    const db = new Datastore({ filename: './configuration' });
    db.loadDatabase(function (err) {
        if (err) console.log(err);
    });
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
    const db = new Datastore({ filename: './configuration' });
    db.loadDatabase(function (err) {
        if (err) console.log(err);
    });
    db.find({}, function (err, docs) {
        if (!err) {
            let config = { contextBrokers: routerReq.body };
            if (docs.length === 0) { insert(db, config) }
            else { update(db, config) }
        }
    });
    routerRes.send();
});

function insert(db, config) {
    db.insert(config, function (err, newDoc) {
    });
}

function update(db, config) {
    db.update({}, config, {}, function (err, numReplaced) {
    });
}

module.exports = router;
