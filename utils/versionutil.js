/**
 * Created by tranvietthang on 6/6/16.
 */

var Version = require('../models/Version');

module.exports = {
    increaseVersionnumber: function (db) {

        Version.findOne({db_name: db}, function (err, version) {
            if (err) {
                console.log(err);
            } else {
                if (version == null) {
                    var version = new Version({
                        db_name: db,
                        version_number: 1
                    })
                    version.save(function(err) {
                        if (err) {
                            console.log(err);
                        }
                    })
                } else {
                    version.version_number = version.version_number + 1;
                    version.save(function (err) {
                        if(err) {
                            console.log(err);
                        }
                    });
                }
            }
        })
    }
};
