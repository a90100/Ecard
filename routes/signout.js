var express = require('express');
var router = express.Router();

// 登出
router.get('/signout', function (req, res) {
  req.session.uid = '';
  res.render('signout');
});

module.exports = router;