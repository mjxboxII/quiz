var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
//*** modulo 8
var methodOverride = require('method-override');
//*** modulo 9
var session = require('express-session');
var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
//app.use(cookieParser('my2015'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());
//** modulo 8
app.use(methodOverride('_method'));
//*** mod 9
app.use(cookieParser()); //semilla para cifrar cookie
app.use(session({ secret: 'mysecret'}));

//MW auto-logout *** modulo 9
app.use(function(req, res, next) {

    //calcular tiempo de inactividad con sesion activa
    if (req.session.user){
       //console.log('Usuario registrado en session @: '+ req.session.user.doTime + 'seg.');

        var sleeptime = new Date();
        var timeinact = ((sleeptime.getMinutes()*60) + sleeptime.getSeconds()) - req.session.user.doTime;

        if (timeinact > 120) {  //2 min. de inactividad
            //console.log('TIMEOUT: Usuario inactivo: '+ timeinact + 'seg.');
            delete req.session.user;

        } else { //Si no se ha excedido, se actualiza/resetea
            //console.log('Usuario inactivo: '+ timeinact + 'seg.');
            req.session.user.doTime = (sleeptime.getMinutes()*60) + sleeptime.getSeconds();
        }    
    }
    next();
});

//Helpers dinamicos: ***modulo 9
app.use(function(req, res, next){

  // si no existe lo inicializa
    if (!req.session.redir) {
        req.session.redir = '/';
     }

    if (!req.path.match(/\/login|\/logout|\/user/)){
        req.session.redir = req.path;
    }
    //Hacer visible req.session en las vistas
    res.locals.session = req.session;
    next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
