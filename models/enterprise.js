/** 
* @author Raphael Colboc
*/
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var EnterpriseSchema   = new Schema(
{
	name: {type : String, required: true}
});

module.exports = mongoose.model('Enterprise', EnterpriseSchema);
