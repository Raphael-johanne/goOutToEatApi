/** 
* @author Raphael Colboc
*/
var express 		= require('express');
var router 			= express.Router();
var mongoose 		= require('mongoose');
var RestaurantType 	= require('../models/restaurantType');
var Item     		= mongoose.model('RestaurantType');
var ServiceUser     = require('../services/user');

/** 
* get restaurant type list
*/
router.get('/restaurantType', function(req, res, next) {

	Item.find(function(err, docs) {

		if (err)
            res.send(err);

		res.json(docs);
	})
});	

/** 
* create restaurant type list	
*/
router.post('/restaurantType/post', function(req, res) {

    ServiceUser.getCurrentUser(res, function(currentUser) {

        var restaurantType 	            = new RestaurantType();      
        restaurantType.name             = req.body.name;  
        restaurantType.enterprise_id    = currentUser.enterprise_id;

        restaurantType.save(function(err) {

            if (err)
                res.send(err);

            res.json({ message: 'Success creation' });
        });
    });
});

/**
* get restaurant type by restaurant type id
*/
router.get('/restaurantType/:restaurant_type_id', function(req, res) {

    ServiceUser.getCurrentUser(res, function(currentUser) {

        Item.findOne({_id : req.params.restaurant_type_id, enterprise_id : currentUser.enterprise_id }, function(err, doc) {

            if (err)
                res.send(err);

            res.json(doc);
        });
    });
});

/**
* remove restaurant type by restaurant type id
*/
router.get('/restaurantType/remove/:restaurant_type_id', function(req, res) {

    ServiceUser.getCurrentUser(res, function(currentUser) {
        
        if (!currentUser.admin) 
            throw "Current user is not allowed to remove this user";

        Item.remove({_id : req.params.restaurant_type_id, enterprise_id : currentUser.enterprise_id}, function(err) {

            if (err)
                res.send(err);

            res.json({ message: 'Success remove' });
        });
    });
});

/**
* update restaurant type by restaurant type id
*/
router.put('/restaurantType/update/:restaurant_type_id', function(req, res) {

    ServiceUser.getCurrentUser(res, function(currentUser) {
        
        Item.findOne({ _id : req.params.restaurant_type_id, enterprise_id : currentUser.enterprise_id }, function(err, doc) {

            if (err)
                res.send(err);

            doc.name = req.body.name;

            doc.save(function(err) {

                if (err)
                    res.send(err);

                res.json({ message: 'Success updated!' });
            });
        });
    });
});

module.exports = router;	
	