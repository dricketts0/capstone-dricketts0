require('dotenv').config();
require('./db');
const User = require('./db').User;
const express = require('express');
const exphbs = require('express-handlebars');
const routes = require('./routes');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

app.use(express.static('public'));
app.use(session({ secret: 'SpringCap2020' }));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.json());

app.engine('hbs', exphbs({ extname: 'hbs' }));
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.title = 'Team Expense!';
  next();
});
app.use(routes);

const listener = app.listen(3000, () => {
  console.log('server listening on port ' + listener.address().port);
});
