/** 
* @author Raphael Colboc
*/
var mongoose	= require('mongoose');
require('../models/user');
var User		= mongoose.model('User');

module.exports = {
	getCurrentUser(res, callback) {
   		
		User.findOne( { email : res.req.user.email }, function(err, doc) {
			
			if (err) 
				throw err;

			if (doc === null) 
				throw 'User is not defined';

			callback(doc);
		})
	}
};	 
