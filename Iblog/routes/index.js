var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/weimei', function(req, res, next) {
  res.render('weimei');
});

router.get('/rizhi', function(req, res, next) {
  res.render('rizhi');
});

router.get('/about',function(req,res,next){
  res.render('about');
})

router.get('/word',function(req,res,next){
  res.render('word');
})


module.exports = router;
