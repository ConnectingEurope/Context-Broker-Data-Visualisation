var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var checkHealthRouter = require('./routes/general/checkHealth');
var subscriptionsRouter = require('./routes/general/subscriptions');
var subscriptionsAttributesRouter = require('./routes/general/subscribedAttributes');
var configurationRouter = require('./routes/configuration/configuration');
var configurationEntitiesRouter = require('./routes/configuration/configurationEntities');
var entitiesSchemaRouter = require('./routes/entities/entitiesSchema');
var entitiesDataRouter = require('./routes/entities/entitiesData');
var entitiesOneRouter = require('./routes/entities/entitiesOne');
var entitiesOneSimplifiedRouter = require('./routes/entities/entitiesOneSimplified');
var rawDataRouter = require('./routes/historic/rawData');
var aggregatedDataRouter = require('./routes/historic/aggregatedData');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*****************************************************************************
 API
*****************************************************************************/

app.use('/', indexRouter);
app.use('/check-health', checkHealthRouter);
app.use('/subscriptions', subscriptionsRouter);
app.use('/subscriptions/attrs', subscriptionsAttributesRouter);
app.use('/entities/schema', entitiesSchemaRouter);
app.use('/entities/data', entitiesDataRouter);
app.use('/entities/one', entitiesOneRouter);
app.use('/entities/one/simplified', entitiesOneSimplifiedRouter);
app.use('/configuration', configurationRouter);
app.use('/configuration/entities', configurationEntitiesRouter);
app.use('/historic/raw', rawDataRouter);
app.use('/historic/aggr', aggregatedDataRouter);

/*****************************************************************************
 Error handler
*****************************************************************************/

app.use(function (req, res, next) {
    console.log('API not found');
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.send();
});

module.exports = app;
