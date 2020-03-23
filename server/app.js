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
var airQualityObservedRouter = require('./routes/airQualityObserved');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/check-broker', checkHealthRouter);
app.use('/check-cygnus', checkHealthRouter);
app.use('/check-comet', checkHealthRouter);
app.use('/entities', entitiesRouter);
app.use('/all', allRouter);
app.use('/config', configRouter);
app.use('/air-quality-observed', airQualityObservedRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
