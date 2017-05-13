/** 
* @author Raphael Colboc
*/
var express 		= require('express');
var router 		    = express.Router();
var mongoose 		= require('mongoose');
var Restaurant 	    = require('../models/restaurant');
var Item            = mongoose.model('Restaurant');
var RestaurantType  = mongoose.model('RestaurantType');
var ServiceUser     = require('../services/user');

/** 
* get restaurant list
*/
router.get('/restaurant', function(req, res, next) {

    ServiceUser.getCurrentUser(res, function(currentUser) {

    	Item.find({enterprise_id : currentUser.enterprise_id}, function(err, docs) {

    		if (err)
                res.send(err);

    		res.json(docs);
    	})
    });
});	

/** 
* create restaurant list	
*/
router.post('/restaurant/post', function(req, res) {
    
    var type_id = req.body.type_id; 

    ServiceUser.getCurrentUser(res, function(currentUser) {
        
        RestaurantType.findOne({type_id : type_id, enterprise_id : currentUser.enterprise_id}, function(err, doc) {

            if (err)
                res.send(err);

            var restaurant              = new Restaurant();
            restaurant.name             = req.body.name;  
            restaurant.type_id          = type_id;  
            restaurant.lat              = req.body.lat; 
            restaurant.lng              = req.body.lng;
            restaurant.enterprise_id    = currentUser.enterprise_id;

            restaurant.save(function(err) {

                if (err)
                    res.send(err);

                res.json({ message: 'Success creation' });
            });
        }); 
    }); 
});

/**
* get restaurant by restaurant id
*/
router.get('/restaurant/:restaurant_id', function(req, res) {

    ServiceUser.getCurrentUser(res, function(currentUser) {

        Item.findOne({_id : req.params.restaurant_id, enterprise_id : currentUser.enterprise_id}, function(err, doc) {

            if (err)
                res.send(err);

            res.json(doc);
        });
    });
});

/**
* remove restaurant by restaurant id
*/
router.get('/restaurant/remove/:restaurant_id', function(req, res) {

    ServiceUser.getCurrentUser(res, function(currentUser) {
        
        if (!currentUser.admin) 
            throw "Current user is not allowed to remove this user";

        Item.remove({_id : req.params.restaurant_id, enterprise_id : currentUser.enterprise_id}, function(err) {

            if (err)
                res.send(err);

            res.json({ message: 'Success remove' });
        });
    });
});

/**
* update restaurant by restaurant id
*/
router.put('/restaurant/update/:restaurant_id', function(req, res) {

    var type_id = req.body.type_id; 
    
    ServiceUser.getCurrentUser(res, function(currentUser) {
        
        Item.findOne({_id : req.params.restaurant_id, enterprise_id : currentUser.enterprise_id}, function(err, doc) {

            if (err)
                res.send(err);

            RestaurantType.findById(type_id, function(err, doc) {

                if (err)
                    res.send(err);

                doc.name        = req.body.name;
                doc.type_id     = type_id;
                doc.lat         = req.body.lat; 
                doc.lng         = req.body.lng; 

                doc.save(function(err) {
                    
                    if (err)
                        res.send(err);

                    res.json({ message: 'Success updated!' });
                });
            });
        });
    });
});

module.exports = router;	
	