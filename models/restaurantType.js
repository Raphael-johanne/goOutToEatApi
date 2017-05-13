/** 
* @author Raphael Colboc
*/
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RestaurantTypeSchema   = new Schema(
{
	name: {type : String, required: true},
	enterprise_id: {type : String, required: true}
});

module.exports = mongoose.model('RestaurantType', RestaurantTypeSchema);
