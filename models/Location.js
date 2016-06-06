var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = new Schema ({
	name: String,
	address: String,
	latitude: Number,
	longitude: Number,
});

var Location = mongoose.model('Location', locationSchema);

module.exports = Location;