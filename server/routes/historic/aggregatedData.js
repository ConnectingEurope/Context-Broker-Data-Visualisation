var express = require('express');
var router = express.Router();
const request = require('request');
const lodash = require('lodash');
const utils = require('../../utils');

router.post('/', function (routerReq, routerRes, routerNext) {

    const b = routerReq.body;

    request({ url: utils.getCometUrl(b), qs: utils.getCometParams(b), headers: utils.getCometHeaders(b), json: true }, (err, res, body) => {
        // An error has been received in the response
        if (err) utils.sendFiwareError(routerRes, res, err);
        else if (lodash.get(body, 'contextResponses[0].contextElement.attributes[0].values[0].points')
            && lodash.get(body, 'contextResponses[0].contextElement.attributes[0].values[1].points')) {
            // There is data for two different lists
            firstList = lodash.get(body, 'contextResponses[0].contextElement.attributes[0].values[0].points');
            secondList = lodash.get(body, 'contextResponses[0].contextElement.attributes[0].values[1].points');
            routerRes.send(firstList.concat(secondList));
        } else if (lodash.get(body, 'contextResponses[0].contextElement.attributes[0].values[0].points')) {
            // There is only data for one list
            routerRes.send(body.contextResponses[0].contextElement.attributes[0].values[0].points);
        }
        // No data has been found
        else routerRes.send([]);
    });

});

module.exports = router;
