const express = require('express');
const router = express.Router();

router.get('/signout', function (req, res) {
  req.session.uid = '';
  res.render('signout');
});

module.exports = router;