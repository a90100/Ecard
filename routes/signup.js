var express = require('express');
var router = express.Router();
var firebaseDb = require('../connection/firebase_admin.js');
var firebase = require('../connection/firebase_auth.js');

// 申請帳號
router.post('/signup', function (req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  let username = req.body.username;
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
      if (errorMessage === 'Password should be at least 6 characters') {
        errorMessage = '密碼必須超過六個字元';
      } else if (errorMessage === 'The email address is already in use by another account.') {
        errorMessage = '此Email已被使用';
      }
      req.flash('error', errorMessage);
      res.redirect('/signup');
    });
})

// 進入註冊頁面
router.get('/signup', function (req, res, next) {
  let auth = req.session.uid;
  res.render('signup', {
    error: req.flash('error'),
    auth: auth
  });
});

module.exports = router;