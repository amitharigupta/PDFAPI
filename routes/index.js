var express = require('express');
var router = express.Router();
const PDFController = require('../controller/PDFController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/generatepdf', PDFController.generatePDF)

module.exports = router;
