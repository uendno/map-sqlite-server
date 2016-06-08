/**
 * Created by tranvietthang on 6/6/16.
 */

var Version = require('../models/Version');

module.exports = {
    setModifiedDate: function (db, next) {

        Version.findOne({db_name: db}, function (err, version) {
            if (err) {
                next(err, null);
            } else {
                if (version == null) {
                    var newVersion = new Version({
                        db_name: db,
                        modified_since: new Date()
                    });

                    newVersion.save(function (err) {
                        if (err) {
                            next(err, null);
                        } else {
                            next(null, newVersion.modified_since);
                        }
                    })
                } else {
                    version.modified_since = new Date();
                    version.save(function (err) {
                        if (err) {
                            next(err, null);
                        } else {
                            next(null, version.modified_since);
                        }
                    });
                }
            }
        })
    },

    getModifiedDate: function (db, next) {

        Version.findOne({db_name: db}, function (err, version) {
            if (err) {
                next(err, null);
            } else {
                if (version == null) {
                    var newVersion = new Version({
                        db_name: db,
                        if_modified_since: new Date()
                    });

                    newVersion.save(function (err) {
                        if (err) {
                            next(err, null);
                        } else {
                            next(null, newVersion.modified_since);
                        }
                    })
                } else {

                    next(null, version.modified_since);

                }
            }
        })
    }
};
