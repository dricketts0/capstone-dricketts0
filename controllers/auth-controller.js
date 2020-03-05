const User = require('../db').User;
const passport = require('passport');

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  if (req.url != '/favicon.ico') {
    req.session.redirectTo = req.url;
  }

  res.redirect('/login');
};

exports.registerPage = (req, res) => {
  res.render('register', { flashes: req.flash('error') });
};

exports.registerUser = (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  User.register(username, password, (error, registeredUser) => {
    if (error) {
      console.log(error);
      res.status(500).send().redirect('/register');
    }
    req.flash('success', 'Welcome new user: ' + username);
    next();
  });
};

exports.loginPage = (req, res) => {
  res.render('login', { flashes: req.flash('error') });
};

exports.loginUser = (req, res, next) => {
  let redirect = req.session.redirectTo || '/';
  // delete req.session.redirectTo;

  passport.authenticate('local', {
    successRedirect: redirect,
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: 'Welcome', 
  })(req, res, next);
};

exports.logoutUser = (req, res) => {
  req.logOut(); //provided by passport
  res.redirect('/login');
};
