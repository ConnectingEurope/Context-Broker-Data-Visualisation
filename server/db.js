const Datastore = require('nedb');

const db =
    new Datastore({
        filename: './configuration.json'
    });

module.exports = db;
