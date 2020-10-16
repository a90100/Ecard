const express = require('express');
const router = express.Router();
const firebaseDb = require('../connection/firebase_admin.js');
const firebase = require('../connection/firebase_auth.js');

router.post('/signup', function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function (user) {
      let userInfo = {
        'email': email,
        'username': username,
        'uid': user.user.uid
      }
      firebaseDb.ref('/user/' + user.user.uid).set(userInfo);
      res.redirect('/login');
    })
    .catch(function (error) {
      let errorMessage = error.message;
      if (errorMessage === 'The password must be 6 characters long or more.') {
        errorMessage = '密碼必須超過六個字元';
      } else if (errorMessage === 'The email address is already in use by another account.') {
        errorMessage = '此Email已被使用';
      }
      req.flash('error', errorMessage);
      res.redirect('/signup');
    });
})

router.get('/signup', function (req, res) {
  const auth = req.session.uid;
  res.render('signup', {
    error: req.flash('error'),
    auth
  });
});

module.exports = router;