var express = require('express');
var router = express.Router();
const request = require('request');
const utils = require('../../utils');

router.post('/', function (routerReq, routerRes, routerNext) {

    const b = routerReq.body;

    request({ url: getUrl(b), headers: utils.getBrokerHeaders(b), json: true }, (err, res, body) => {
        if (err) utils.sendFiwareError(routerRes, res, err);
        else {
            const attrs = new Set();
            body.forEach(subscription => {
                if (subscription.subject.entities.some(e => checkIfIdMatchs(e, b.entityId))) {
                    subscription.notification.attrs.forEach(a => attrs.add(a));
                }
            });
            routerRes.send(Array.from(attrs));
        }
    });

    function getUrl(b) {
        return utils.parseUrl(b.contextUrl) + "/v2/subscriptions/";
    }

    function checkIfIdMatchs(entityPattern, entityId) {
        return entityPattern.id && entityPattern.id === entityId ||
            entityPattern.idPattern && (new RegExp(entityPattern.idPattern)).test(entityId);
    }

});

module.exports = router;
