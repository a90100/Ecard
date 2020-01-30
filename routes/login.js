var express = require('express');
var router = express.Router();
var firebase = require('../connection/firebase_auth.js');

// 登入輸入資料
router.post('/login', function (req, res) {
  let email = req.body.email;
  let password = req.body.password;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function (user) {
      req.session.uid = user.user.uid;
      res.redirect('/index');
    })
    .catch(function (error) {
      console.log(error);
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

// 登入功能
router.get('/login', function (req, res, next) {
  let auth = req.session.uid;
  res.render('login', {
    error: req.flash('error'),
    auth: auth
  });
});

module.exports = router;