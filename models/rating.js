/** 
* @author Raphael Colboc
*/
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RatingSchema   = new Schema(
{
	name: {type : String, required: true},	
	type_id: {type : String, required: true}
});

module.exports = mongoose.model('Rating', RatingSchema);
