var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.send();
});

/*****************************************************************************
 API
*****************************************************************************/

var indexRouter = require('./routes/index');
var checkHealthRouter = require('./routes/general/checkHealth');
var subscriptionsRouter = require('./routes/general/subscriptions');
var subscriptionsAttributesRouter = require('./routes/general/subscribedAttributes');
var configurationRouter = require('./routes/configuration/configuration');
var configurationEntitiesRouter = require('./routes/configuration/configurationEntities');
var entitiesSchemaRouter = require('./routes/entities/entitiesSchema');
var entitiesDataRouter = require('./routes/entities/entitiesData');
var entitiesOneRouter = require('./routes/entities/entitiesOne');
var rawDataRouter = require('./routes/historic/rawData');
var aggregatedDataRouter = require('./routes/historic/aggregatedData');

app.use('/', indexRouter);
app.use('/check-health', checkHealthRouter);
app.use('/subscriptions', subscriptionsRouter);
app.use('/subscriptions/attrs', subscriptionsAttributesRouter);
app.use('/entities/schema', entitiesSchemaRouter);
app.use('/entities/data', entitiesDataRouter);
app.use('/entities/one', entitiesOneRouter);
app.use('/configuration', configurationRouter);
app.use('/configuration/entities', configurationEntitiesRouter);
app.use('/historic/raw', rawDataRouter);
app.use('/historic/aggr', aggregatedDataRouter);

module.exports = app;
