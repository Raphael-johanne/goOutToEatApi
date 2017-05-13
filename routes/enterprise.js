/** 
* @author Raphael Colboc
*/
var express 		= require('express');
var router 			= express.Router();
var mongoose 		= require('mongoose');
var Enterprise 		= require('../models/enterprise');
var Item     		= mongoose.model('Enterprise');

/** 
* get enterprise list
*/
router.get('/enterprise', function(req, res, next) {

	Item.find(function(err, docs) {

		if (err)
            res.send(err);

		res.json(docs);
	})
});	

/** 
* create enterprise	
*/
router.post('/enterprise/post', function(req, res) {
    
    var enterprise 	= new Enterprise();      
    enterprise.name = req.body.name;  

    enterprise.save(function(err, doc) {

        if (err)
            res.send(err);

        res.json({ message: 'Success creation', enterprise_id : doc._id });
    });
});

/**
* get enterprise by enterprise id
*/
router.get('/enterprise/:enterprise_id', function(req, res) {

    Item.findById(req.params.enterprise_id, function(err, doc) {

        if (err)
            res.send(err);

        res.json(doc);
    });
});

/**
* update enterprise by enterprise id
*/
router.put('/enterprise/update/:enterprise_id', function(req, res) {

    Item.findById(req.params.enterprise_id, function(err, doc) {

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

module.exports = router;	
	