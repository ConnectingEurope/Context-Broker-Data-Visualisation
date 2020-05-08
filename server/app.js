var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

app.use('/', indexRouter);

app.use('/check-health', checkHealthRouter);

app.use('/entities/schema', entitiesSchemaRouter);
app.use('/entities/data', entitiesDataRouter);
app.use('/entities/one', entitiesOneRouter);

app.use('/configuration', configurationRouter);
app.use('/configuration/entities', configurationEntitiesRouter);

app.use('/subscriptions', subscriptionsRouter);

app.use('/historical-data', historicalDataRouter);

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
var checkHealthRouter = require('./routes/checkHealth');
var entitiesSchemaRouter = require('./routes/entitiesSchema');
var entitiesDataRouter = require('./routes/entitiesData');
var entitiesOneRouter = require('./routes/entitiesOne');
var configurationRouter = require('./routes/configuration');
var configurationEntitiesRouter = require('./routes/configurationEntities');
var subscriptionsRouter = require('./routes/subscriptions');
var historicalDataRouter = require('./routes/historicalData');

app.use('/', indexRouter);
app.use('/check-health', checkHealthRouter);
app.use('/entities/schema', entitiesSchemaRouter);
app.use('/entities/data', entitiesDataRouter);
app.use('/entities/one', entitiesOneRouter);
app.use('/configuration', configurationRouter);
app.use('/configuration/entities', configurationEntitiesRouter);
app.use('/subscriptions', subscriptionsRouter);
app.use('/historical-data', historicalDataRouter);

module.exports = app;
