var express = require('express');
var router = express.Router();
var User = require('../models/user');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport) {

  router.get('/', function(req, res) {
      // Display the Login page with any flash message, if any
  		if (req.isAuthenticated()) {
  			res.redirect('/findtutor');
  		} else {
  			res.render('index', { title: 'SmartTi.me', message: req.flash('message') });
  		}
  	});

  /*router.get('/helloworld', function(req, res){
    res.render('helloworld', {title:'Hello, World!'});
  });*/

  //final login GET
  router.get('/login', function(req, res) {
    res.render('login', {title: 'Log in or sign up', message: req.flash('message')});
  });

  //final login POST
  router.post('/signin', passport.authenticate('login', {
      failureRedirect: '/login',
      failureFlash : true
  }), function(req, res) {
			res.redirect('map');
});

  //final registration POST
  router.post('/signup', passport.authenticate('signup', {
				successRedirect:'/map',
				failureRedirect:'/',
	      failureFlash : true
	}));

	router.get('/newtask', function(req, res) {
	    res.render('newtask', { title: 'Add New Task' });
	});

	router.post('/tasklist', isAuthenticated, function(req, res) {
		res.render('tasklist', { user: req.user });
	});

	router.get('/map', isAuthenticated, function(req, res){
		res.render('map', {
			"user": req.user
		});
	});


  router.get('/userlist', function(req, res) {
      var db = req.db;
      var collection = db.get('usercollection');
			if(req.user){
				var uname = req.user.username
			}
      collection.find({},{},function(e,docs){
          res.render('userlist', {
              "userlist": docs
          });
      });
  });

  router.get('/newuser', function(req, res) {
      res.render('signup', { title: 'Add New User' });
  });

  router.post('/adduser', function(req, res){
    var db = req.db;

    var userName = req.body.username;
    var userPassword = req.body.userpassword;
    var name = req.body.name;
		var grade = req.body.grade;
		var tutor = req.body.tutor;
		var tutee = req.body.tutee;
		var location = req.body.location;

		var subjects = []
		var classes = []
		var ratings = [-1]
		if(tutor){
			var subjects = req.body.subjects
			var classes = req.body.classes
			var ratings = [5]
		}

    var collection = db.get('usercollection');

    collection.insert({
      "username" : userName,
      "password" : userPassword,
      "name": name,
			"grade": grade,
			"tutor": tutor,
			"tutee": tutee,
			"active": false,
			"subjects": subjects,
			"classes": classes,
			"ratings": ratings,
			"location": location
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

	router.get('/findtutor', isAuthenticated, function(req, res){
			res.render('find_tutor', {title: 'Find a Tutor'});
	});

	router.get('/averages', isAuthenticated, function(req, res){
	  var db = req.db;
	  var collection = db.get('taskcollection');
	  collection.find({},{},function(e,docs){
	    function allNames(){
	       var names=[];
	       for(var i = 0; i < docs.length; i++){
	         if(names.indexOf(docs[i].name) <= -1){
	           names.push(docs[i].name);
	          }
	       }
	       return names;
	     }
	  res.render('averages', {
	    "tasklist" : docs,
	    "allNames": allNames()
	    });
	  });
	});
  /* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

  return router;

}
