const request = require('request');

const types = ['AirQualityObserved', 'OffStreetParking'];

const samples = 500;

const entitiesUrl = 'http://localhost:1026/v2/entities';

types.forEach(t => processType(t));

function processType(type) {
    let count = 1;
    while (count <= samples) {
        post(count, getPayload(count, type), type);
        count++;
    }
}

function post(c, b, t) {
    request.post({ url: entitiesUrl, headers: getHeaders(t), body: b, json: true }, (err, res, body) => {
        if (body) { return console.log(c, body); }
        console.log('Added entity', t, c);
    });
}

function getHeaders(type) {
    return {
        'fiware-service': 'openiot',
        'fiware-servicepath': '/' + type,
    };
}

function getPayload(c, t) {
    return {
        "id": "urn:ngsi-ld:" + t + ":" + c,
        "type": t,
        "location": {
            "type": "geo:json",
            "value": {
                "type": "Point",
                "coordinates": generateRandomLatLon()
            }
        }
    };
}

function generateRandomLatLon() {
    const lat = randomNumberFromInterval(37.890676, 42.897983);
    const lon = randomNumberFromInterval(-8.246180, -1.150096);
    return [lat, lon];
}

function randomNumberFromInterval(min, max) {
    return Math.random() * (max - min) + min;
}
