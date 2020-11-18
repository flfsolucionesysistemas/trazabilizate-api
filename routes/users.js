var express = require('express');
var router = express.Router();
var ctlUsers = require('../controllers/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/addPersona',ctlUsers.addPersona);
router.post('/addComercio',ctlUsers.addComercio);
router.post('/userLogin',ctlUsers.userLogin);

module.exports = router;
