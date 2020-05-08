var express = require('express');
var router = express.Router();
const request = require('request');
const lodash = require('lodash');
const utils = require('../../utils');

router.post('/aggr', function (routerReq, routerRes, routerNext) {

    const b = routerReq.body;

    request({ url: getCometUrl(b), qs: getCometParams(b), headers: utils.getCometHeaders(b), json: true }, (err, res, body) => {
        if (err) utils.sendFiwareError(routerRes, res, err);
        else if (lodash.get(b, 'contextResponses[0].contextElement.attributes[0].values[0].points'))
            routerRes.send(b.contextResponses[0].contextElement.attributes[0].values[0].points);
        else routerRes.send([]);
    });
});

module.exports = router;
