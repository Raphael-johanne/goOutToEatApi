/** 
* @author Raphael Colboc
*/
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RestaurantSchema   = new Schema(
{
	name: {type : String, required: true},	
	type_id: {type : String, required: true},
	lat: {type : String },
	lng: {type : String },
	enterprise_id: {type : String, required: true}
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
