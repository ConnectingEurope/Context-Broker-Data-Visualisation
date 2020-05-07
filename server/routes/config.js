const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.get('/', function (routerReq, routerRes, routerNext) {

    db.loadDatabase(function (err) {
        if (err) routerRes.status(500).send();
        else {
            db.find({}, function (err, docs) {
                if (!err) {
                    if (docs.length === 0) { routerRes.send([]); }
                    else {
                        routerRes.send(docs[0].contextBrokers);
                    }
                }
            });
        }
    });

});

router.post('/', function (routerReq, routerRes, routerNext) {

    db.loadDatabase(function (err) {
        if (err) routerRes.status(500).send();
        else {
            db.find({}, function (err, docs) {
                if (!err) {
                    let config = { contextBrokers: routerReq.body };
                    if (docs.length === 0) { insert(db, config, routerRes) }
                    else { update(db, config, routerRes) }
                }
            });
        }
    });
});

function insert(db, config, routerRes) {
    db.insert(config, function (err, newDoc) {
        routerRes.send();
    });
}

function update(db, config, routerRes) {
    db.update({}, config, {}, function (err, numReplaced) {
        routerRes.send();
    });
}

module.exports = router;
