var express = require('express');
var router = express.Router();
const request = require('request');
const utils = require('./utils');
const db = require('./db.js');

router.get('/all', function (req, res, next) {

    db.loadDatabase(function (err) {
        if (err) res.status(500).send(err);
        else {
            db.find({}, function (err, docs) {
                if (!err) {
                    if (docs.length === 0) { res.send([]); }
                    else {
                        let entities = [];
                        docs[0].contextBrokers.forEach(context => {
                            context.entities.forEach((entity) => {
                                if (entity.selected) {
                                    let exist = entities.find((element) => {
                                        return element.name == entity.name;
                                    });
                                    if (!exist) { entities.push(entity); }
                                }
                            });

                            context.services.forEach((service) => {
                                service.entities.forEach((entity) => {
                                    if (entity.selected) {
                                        // Add entity if it does not exist.
                                        let entityExists = entities.find((element) => {
                                            return element.name == entity.name;
                                        });
                                        if (!entityExists) {
                                            entity.attrs = entity.attrs.filter((attr) => attr.selected);
                                            entities.push(entity);
                                        } else {
                                            // Add attribute if it does not exist.
                                            entity.attrs.forEach((attr) => {
                                                let attrExists = entityExists.attrs.find((element) => {
                                                    return element.name == attr.name;
                                                });
                                                if (!attrExists && attr.selected) { entityExists.attrs.push(attr) };
                                            });
                                        }
                                    }
                                });
                            })
                        });
                        res.send(entities);
                    }
                }
            });
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
