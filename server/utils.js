function parseUrl(url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'http://' + url;
    return url;
}

module.exports = {

    parseUrl: parseUrl,

    getBrokerHeaders: function (obj) {
        const headers = {};
        if (obj) {
            if (obj.service !== undefined) headers['fiware-service'] = obj.service;
            if (obj.servicePathb !== undefined) headers['fiware-servicepath'] = obj.servicePath;
        }
        return headers;
    },

    getCometUrl: function (obj) {
        return parseUrl(obj.cometUrl) + "/STH/v1/contextEntities/type/" + obj.type + "/id/" + obj.id + "/attributes/" + obj.attr;
    },

    getCometParams: function (obj) {
        return obj.operationParameters;
    },

    getCometHeaders: function (obj) {
        const headers = {
            'fiware-service': obj.service ? obj.service : '/',
            'fiware-servicepath': obj.servicePath ? obj.servicePath : '/',
        };
        return headers;
    },

    sendDbError: function (routerRes, err) {
        routerRes.status(500).send(err)
    },

    sendFiwareError: function (routerRes, res, err) {
        console.log(err);
        console.log(res);
        routerRes.status(res && res.statusCode ? res.statusCode : 404).send(err);
    },

};