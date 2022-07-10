var express = require('express');
var router = express.Router();
const PDFController = require('../controller/PDFController');
const OrderPDFController = require('../controller/OrderPDFController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/generatepdf', PDFController.generatePDF)

router.post('/orderpdf', OrderPDFController.orderPDF)

module.exports = router;
