var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/helloworld', function(req, res){
  res.render('helloworld', {title:'Hello, World!'});
});

router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

router.get('/tasklist', function(req, res) {
    var db = req.db;
    var collection = db.get('taskcollection');
    collection.find({},{},function(e,docs){
       if (docs.length > 0){
        var earliest = 25;
        var latest = 0;
        sunday = [];
        monday = [];
        tuesday = [];
        wednesday = [];
        thursday = [];
        friday = [];
        saturday = [];
        for(var i = 0; i < docs.length; i ++){
          switch(docs[i].day){
            case "Sunday":
              sunday.push(docs[i]);
              break;
            case 'Monday':
              monday.push(docs[i]);
              break;
            case 'Tuesday':
              tuesday.push(docs[i]);
              break;
            case 'Wednesday':
              wednesday.push(docs[i]);
              break;
            case 'Thursday':
              thursday.push(docs[i]);
              break;
            case 'Friday':
              friday.push(docs[i]);
              break;
            case 'Saturday':
              saturday.push(docs[i]);
              break;

          }
          var hour = parseInt(docs[i].start.split(':')[0])
          if(hour < earliest){
            earliest = hour;
          }
          if(hour >= latest){
            latest = hour + 1;
          }
        }
        byDay = [sunday, monday, tuesday, wednesday, thursday, friday, saturday]
        for(var i = 0; i < byDay.length; i++){
          byDay[i].sort(function(a, b) {
              return parseFloat(a.start.split(':')[0]) - parseFloat(b.start.split(':')[0]);
            });
          }
      }
      else {
        byDay = []
      }
        res.render('tasklist', {
            "tasklist" : docs,
            "earliestHour" : earliest,
            "latestHour" : latest,
            "totalHours" : latest-earliest,
            "byDay": byDay
        });
    });
});

router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});

router.post('/adduser', function(req, res){
  var db = req.db;

  var userName = req.body.username;
  var userEmail = req.body.useremail;
  var userDob = req.body.userdob

  var collection = db.get('usercollection');

  collection.insert({
    "username" : userName,
    "email" : userEmail,
    "dob" : userDob
  }, function (err, doc){
    if(err){
      res.send("fukin error m8");
    }
    else{
      res.redirect("userlist");
      }
  });
});

router.get('/newtask', function(req, res) {
    res.render('newtask', { title: 'Add New Task' });
});

router.post('/addtask', function(req, res){
  var db = req.db;

  var taskName = req.body.taskName;
  var taskTime = req.body.taskTime;
  var taskStart = req.body.taskStart;
  var taskDay = req.body.taskDay;

  var collection = db.get('taskcollection');

  collection.insert({
    "name" : taskName,
    "time" : taskTime,
    "start" : taskStart,
    "day" : taskDay
  }, function (err, doc){
    if(err){
      res.send("fukin error m8");
    }
    else{
      res.redirect("tasklist");
      }
  });
});

module.exports = router;
