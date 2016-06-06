var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var versionSchema = new Schema ({
    db_name: String,
    version_number: Number,
});

var Location = mongoose.model('Version', versionSchema);

module.exports = Location;