var express = require('express');
var router = express.Router();
var ctlRegistracion = require('../controllers/registracion');

/* GET users listing. */

router.post('/addCheckIn',ctlRegistracion.addCheckIn);

module.exports = router;
