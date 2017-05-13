/** 
* @author Raphael Colboc
*/
var express 		= require('express');
var router 			= express.Router();
var mongoose 		= require('mongoose');
var User 	        = require('../models/user');
var Item            = mongoose.model('User');
var Enterprise      = mongoose.model('Enterprise');
var bCrypt          = require('bcrypt-nodejs');
var ServiceUser     = require('../services/user');

/** 
* get user list
*/
router.get('/user', function(req, res, next) {

    ServiceUser.getCurrentUser(res, function(currentUser) {

        if (!currentUser.admin) 
            throw "Current user is not allowed to list user";
	   
        Item.find({ enterprise_id : currentUser.enterprise_id }, function(err, docs) {

    		if (err)
                res.send(err);

    		res.json(docs);
	   })
    });    
});	

/** 
* create user
*/
router.post('/user/post', function(req, res) {
    
     ServiceUser.getCurrentUser(res, function(currentUser) {

        if (!currentUser.admin) 
            throw "Current user is not allowed to create user";

        var user            = new User();      
        user.email          = req.body.email;  
        user.password       = bCrypt.hashSync(req.body.password, bCrypt.genSaltSync(10), null); 
        user.enterprise_id  = currentUser.enterprise_id; 
        user.admin          = false;

        user.save(function(err) {

            if (err)
                res.send(err);

            res.json({ message: 'Success creation' });
        }); 
    });
});

/** 
* create admin user
*/
router.post('/user/createAdmin', function(req, res) {
    
    Enterprise.findById(req.body.enterprise_id, function(err, doc) {
        
        if (err)
            res.send(err);

        if (doc === null)
            throw "The enterprise does not exist";

        var user            = new User();      
        user.email          = req.body.email;  
        user.password       = bCrypt.hashSync(req.body.password, bCrypt.genSaltSync(10), null); 
        user.enterprise_id  = req.body.enterprise_id; 
        user.admin          = 1;

        user.save(function(err) {

            if (err)
                res.send(err);

            res.json({ message: 'Success creation' });
        }); 
    }); 
});

/**
* get user by user id
*/
router.get('/user/:user_id', function(req, res) {

    ServiceUser.getCurrentUser(res, function(currentUser) {

        if (!currentUser.admin && req.params.user_id != currentUser.user_id) 
            throw "Current user is not allowed to update this user";

        Item.findOne({_id : req.params.user_id, enterprise_id : currentUser.enterprise_id}, function(err, doc) {

            if (err)
                res.send(err);

            res.json(doc);
        });
    });
});

/**
* remove user by user id
*/
router.get('/user/remove/:user_id', function(req, res) {

    ServiceUser.getCurrentUser(res, function(currentUser) {

        if (!currentUser.admin) 
            throw "Current user is not allowed to remove this user";

        if (currentUser._id == req.params.user_id)
            throw "Current admin cannot remove itself";

        Item.remove({_id : req.params.user_id, enterprise_id : currentUser.enterprise_id}, function(err) {

            if (err)
                res.send(err);

            res.json({ message: 'Success remove' });
        });
    });
});

/**
* update user by user id
*/
router.put('/user/update/:user_id', function(req, res) {
   
    ServiceUser.getCurrentUser(res, function(currentUser) {

        if (!currentUser.admin && req.params.user_id != currentUser.user_id) 
            throw "Current user is not allowed to update this user";

        Item.findOne({_id : req.params.user_id, enterprise_id : currentUser.enterprise_id}, function(err, doc) {

            if (err)
                res.send(err);

            doc.email       = req.body.name;
            doc.password    = (req.body.password) ? bCrypt.hashSync(req.body.password, bCrypt.genSaltSync(10), null) : doc.password;

            doc.save(function(err) {

                if (err)
                    res.send(err);

                res.json({ message: 'Success updated!' });
            });
        });
    });
});

module.exports = router;	
	