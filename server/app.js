var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var checkHealthRouter = require('./routes/checkHealth');
var entitiesRouter = require('./routes/entities');
var allRouter = require('./routes/all');
var configRouter = require('./routes/config');
var historicalData = require('./routes/historicalData');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API
app.use('/', indexRouter);
app.use('/check', checkHealthRouter);
app.use('/entities', entitiesRouter);
app.use('/config', configRouter);
app.use('/all', allRouter);
app.use('/historical-data', historicalData);

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

module.exports = app;
