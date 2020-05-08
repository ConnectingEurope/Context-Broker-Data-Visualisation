module.exports = {

    parseUrl: function (url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'http://' + url;
        return url;
    },

    getHeaders: function (obj) {
        const headers = {};
        if (obj) {
            if (obj.service !== undefined) headers['fiware-service'] = obj.service;
            if (obj.servicePathb !== undefined) headers['fiware-servicepath'] = obj.servicePath;
        }
        return headers;
    },

    sendFiwareError: function (routerRes, res, err) { routerRes.status(res.statusCode).send(err); },

    sendDbError: function (routerRes, err) { routerRes.status(500).send(err) },

};