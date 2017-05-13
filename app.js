/** 
* @author Raphael Colboc
*/
var express       = require('express');
var path          = require('path');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var mongoose      = require('mongoose');
var expressJWT    = require('express-jwt');
var jwt           = require('jsonwebtoken');

// database connection
mongoose.connect('mongodb://localhost:27017/goouttoeat');
require('./models/restaurantType');
require('./models/restaurant');
require('./models/user');
require('./models/enterprise');

var bCrypt  = require('bcrypt-nodejs');
var User    = require('./models/user');
var app     = express();

// routes
var index             = require('./routes/index');
var restaurantType    = require('./routes/restaurantType');
var restaurant        = require('./routes/restaurant');
var user              = require('./routes/user');
var enterprise        = require('./routes/enterprise');
var config            = require('./services/config');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());  
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressJWT({secret:config.secretkey}).unless({path:['/api/login', '/api/user/createAdmin', '/api/enterprise/post']}));

// apply this rule to all requests accessing any URL/URI
app.all('*', function(req, res, next) {
    // add details of what is allowed in HTTP request headers to the response headers
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', false);
    res.header('Access-Control-Max-Age', '86400');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization');
    // the next() function continues execution and will move onto the requested URL/URI
    next();
});

app.post('/api/login', function(req, res) {

  if (!req.body.email) {
    res.status(400).send('Email required');
    return;
  }

  if (!req.body.password) {
    res.status(400).send('Password required');
    return;
  }
  
  User.findOne({email:req.body.email}, function(err, user){
      
      if (err)  
        throw err;

      if(user === null || !bCrypt.compareSync(req.body.password, user.password)) {
        res.status(200).json({});
        return;
      }

      var token = jwt.sign({email:req.body.email}, config.secretkey);
      res.status(200).json(token);
  })
});

app.use('/', index);
app.use('/api', restaurantType);
app.use('/api', restaurant);
app.use('/api', user);
app.use('/api', enterprise);

// fulfils pre-flight/promise request
app.options('*', function(req, res) {
    res.send(200);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	
  var err    = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
