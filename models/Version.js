var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var versionSchema = new Schema ({
    db_name: String,
    modified_since: Date
});

var Location = mongoose.model('Version', versionSchema);

module.exports = Location;