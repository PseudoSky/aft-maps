var gm = require('gm').subClass({imageMagick: true});
var fs = require('fs');
var GoogleMapsAPI = require('googlemaps');
var express = require('express');
var router = express.Router();
var path = require('path');
var child_process = require('child_process');
var util = require('util');

var imgPath = path.resolve(__dirname, '../public/images/map.png');
var bmpPath = path.resolve(__dirname, '../public/images/map.bmp');
var dxfPath = path.resolve(__dirname, '../public/images/map.dxf');

var gMaps = new GoogleMapsAPI({
  key: 'AIzaSyDKRamxygJm5g2I_4Usj7ldFwgpWG6h2-Y',
  secure: true
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'AFT Maps' });
});

router.get('/capture', function(req, res, next) {
  res.setHeader('content-type', 'application/octet-stream');
  res.setHeader('content-disposition', 'attachment; filename=\"map.dxf\"');

  gMaps.staticMap({
    center: req.query.lat + ',' + req.query.lng,
    zoom: parseInt(req.query.zoom),
    size: '1500x1200',
    maptype: 'roadmap',
    // style: [{
    //   feature: 'all',
    //   rules: {
    //     saturation: -100
    //   }
    // }]
    // style: [{"feature":"road","element":"labels","rules":[{"visibility":"on"}]},{"feature":"poi","rules":[{"visibility":"off"}]},{"feature":"administrative","rules":[{"visibility":"off"}]},{"feature":"road","element":"geometry.fill","rules":[{"color":"#000000"},{"weight":1}]},{"feature":"road","element":"geometry.stroke","rules":[{"color":"#000000"},{"weight":0.8}]},{"feature":"landscape","rules":[{"color":"#ffffff"}]},{"feature":"water","rules":[{"visibility":"off"}]},{"feature":"transit","rules":[{"visibility":"off"}]},{"element":"labels","rules":[{"visibility":"off"}]},{"element":"labels.text","rules":[{"visibility":"on"}]},{"element":"labels.text.stroke","rules":[{"color":"#ffffff"}]},{"element":"labels.text.fill","rules":[{"color":"#000000"}]},{"element":"labels.icon","rules":[{"visibility":"on"}]}],
  }, function(err, img) {
    fs.writeFile(imgPath, img, 'binary', function(err) {

      child_process.execFile('convert', [imgPath, '-negate', '-threshold', '0', bmpPath], function(err, stdout, stderr) {
        child_process.execFile('potrace', [bmpPath, '-b', 'dxf'], function(err, stdout, stderr) {
          fs.createReadStream(dxfPath).pipe(res);
        });
      });
      // gm()
      //   .out(imgPath)
      //   .out('-negate')
      //   .out('-threshold')
      //   .out('0')
      //   .out('-negate')
      //   .out(bmpPath)
      //   .write(bmpPath, function(err) {
      // });
    });


  });
});

module.exports = router;
