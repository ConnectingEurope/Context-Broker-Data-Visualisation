const express = require('express');
const router = express.Router();
const db = require('../../db.js');
const utils = require('../../utils');

router.get('/', function (routerReq, routerRes, routerNext) {

    db.loadDatabase(function (err) {
        if (err) utils.sendDbError(routerRes, err);
        else {
            db.find({}, function (err, docs) {
                if (err || docs.length === 0) { routerRes.send([]); }
                else {
                    routerRes.send(docs[0].contextBrokers);
                }
            });
        }
    });

});

router.post('/', function (routerReq, routerRes, routerNext) {

    db.loadDatabase(function (err) {
        if (err) utils.sendDbError(routerRes, err);
        else {
            db.find({}, function (err, docs) {
                if (!err) {
                    let config = { contextBrokers: routerReq.body };
                    if (docs.length === 0) { insert(db, config, routerRes) }
                    else { update(db, config, routerRes) }
                }
                else {
                    utils.sendDbError(routerRes, err);
                }
            });
        }
    });
});

function insert(db, config, routerRes) {
    db.insert(config, function (err, newDoc) { sendResponse(err, routerRes); });
}

function update(db, config, routerRes) {
    db.update({}, config, {}, function (err, numReplaced) { sendResponse(err, routerRes); });
}

function sendResponse(err, routerRes) {
    if (err) utils.sendDbError(routerRes, err);
    else { routerRes.send(); }
}

module.exports = router;
