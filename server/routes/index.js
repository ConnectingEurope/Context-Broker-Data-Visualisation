var express = require('express');
var router = express.Router();

router.get('/', function (routerReq, routerRes, routerNext) {
    routerRes.send('Express server is live');
});

module.exports = router;
