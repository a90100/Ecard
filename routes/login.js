const express = require('express');
const router = express.Router();
const firebase = require('../connection/firebase_auth.js');

// login input feature
router.post('/login', function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function (user) {
      req.session.uid = user.user.uid;
      res.redirect('/index');
    })
    .catch(function (error) {
      if (error.message === 'There is no user record corresponding to this identifier. The user may have been deleted.') {
        error.message = '找不到該用戶';
      } else if (error.message === 'The password is invalid or the user does not have a password.') {
        error.message = '密碼不能留白或有輸入錯誤';
      } else if (error.message === 'The email address is badly formatted.') {
        error.message = 'Email 不能留白或有輸入錯誤';
      }
      req.flash('error', error.message);
      res.redirect('/login');
    });
})

// enter login page
router.get('/login', function (req, res) {
  const auth = req.session.uid;
  res.render('login', {
    error: req.flash('error'),
    auth
  });
});

module.exports = router;