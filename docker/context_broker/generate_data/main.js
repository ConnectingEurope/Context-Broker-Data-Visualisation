const request = require('request');

const samples = 500;

const entitiesUrl = 'http://localhost:1026/v2/entities';

const heads = {
    'fiware-service': 'openiot',
    'fiware-servicepath': '/AIR_QUALITY_OBSERVED',
};

let count = 1;
while (count <= samples) {
    post(count, getPayload(count));
    count++;
}

function post(c, b) {
    request.post({ url: entitiesUrl, headers: heads, body: b, json: true }, (err, res, body) => {
        if (body) { return console.log(c, body); }
        console.log('Added entity ' + c);
    });
}

function getPayload(c) {
    return {
        "id": "urn:ngsi-ld:AirQualityObserved:" + c,
        "type": "AirQualityObserved",
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
