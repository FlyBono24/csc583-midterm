const express = require('express'),
      path = require('path'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      passport = require('passport'),
      session = require('express-session'),
      cel = require('connect-ensure-login'),
      count = require('./server/routes/count'),
      auth = require('./server/routes/auth'),
      index = require('./server/routes/index'),
      users = require('./server/routes/users'),
      MongoStore = require('connect-mongo')(session)

require('dotenv').load();
require('./passport')(passport)

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI);

let app = express()

app.use(express.static(path.join(__dirname, './dist')))
app.use(session({
  secret: 'toro-net',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ url: process.env.MONGO_URI })
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/auth', auth)
app.use('/count', count)
app.use('/', index)
app.use('/users', users)

/* Catch all errors and log them. */
app.use(function(err, req, res, next) {
  console.log(err);
})

const port =  process.env.PORT || 3000;
app.listen(port, () => console.log('Running on localhost:', port))
