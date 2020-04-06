var express = require('express');
var router = express.Router();
const request = require('request');
const utils = require('./utils');
const Datastore = require('nedb');

router.get('/all', function (req, res, next) {
    const db = new Datastore({ filename: './configuration.json' });
    db.loadDatabase(function (err) {
        if (err) console.log(err);
    });
    db.find({}, function (err, docs) {
        if (!err) {
            if (docs.length === 0) { res.send([]); }
            else {
                let entities = [];
                docs[0].contextBrokers.forEach(context => {
                    context.entities.forEach((entity) => {
                        let exist = entities.find((element) => {
                            return element.name == entity.name;
                        });
                        if (!exist) { entities.push(entity); }
                    });

                    context.services.forEach((service) => {
                        service.entities.forEach((entity) => {
                            // Add entity if it does not exist.
                            let entityExists = entities.find((element) => {
                                return element.name == entity.name;
                            });
                            if (!entityExists) {
                                entities.push(entity);
                            } else {
                                // Add attribute if it does not exist.
                                entity.attrs.forEach((attr) => {
                                    let attrExists = entityExists.attrs.find((element) => {
                                        return element.name == attr.name;
                                    });
                                    if (!attrExists) { entityExists.attrs.push(attr) };
                                });
                            }
                        });
                    })
                });
                res.send(entities);
            }
        }
    });
});

router.get('/', function (req, res, next) {

    const url = utils.parseUrl(req.query.url) + '/v2/types';
    const headers = {};
    if (req.query.service !== undefined) headers['fiware-service'] = req.query.service;
    if (req.query.servicePath !== undefined) headers['fiware-servicepath'] = req.query.servicePath;

    request({ url: url, headers: headers, json: true }, (e, r, b) => {
        if (b) {
            res.send(b);
        } else {
            res.status(404).send();
        }
    });

});

module.exports = router;
