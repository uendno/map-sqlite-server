var express = require('express');
var Location = require('../models/Location');
var router = express.Router();
var versionutil = require('../utils/versionutil');

/* GET users listing. */
router.get('/', function (req, res) {

    //check version number
    if (req.headers["if_modified_date"] ==null) {
        return res.send({
            success: false,
            message: "Null if_modified_date"
        });
    } else {

        versionutil.getModifiedDate('locations', function(err, date) {
            if (err) {
                console.log(err);
                return res.send({
                    success: false,
                    message: err.message
                });
            } else {

                console.log(req.headers["if_modified_date"] +" " + date.toISOString() + " ");
                console.log(req.headers["if_modified_date"] == date.toISOString());


                if (req.headers["if_modified_date"] == date.toISOString()) {
                    return res.send({
                        success: false,
                        message: "Nothing new"
                    });
                } else {
                    Location.find({}, function (err, locations) {

                        if (!err) {

                            return res.send({
                                success: true,
                                data: locations,
                                modified_since: date
                            });
                        } else {
                            console.log(err);
                            return res.send({
                                success: false,
                                message: err.message
                            });
                        }
                    })
                }
            }
        })
    }
});

router.get('/init', function (req, res) {

    var location = new Location({
        name: "test",
        address: "abc",
        latitude: 1,
        longitude: 2
    });

    location.save(function (err) {
        if (err) {
            return res.send({
                success: false,
                message: err.message,

            });
        } else {

            versionutil.setModifiedDate('locations', function(err, date) {
                if (err) {
                    return res.send({
                        success: false,
                        message: err.message,

                    });
                } else {
                    return res.send({
                        success: true,
                        message: "Init complete",
                        _id: location._id,
                        modified_since: date
                    });
                }
            })
        }
    });
});

router.post('/', function (req, res) {

    var location = new Location({
        name: req.body.name,
        address: req.body.address,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
    });

    location.save(function (err) {
        if (err) {
            return res.send({
                success: false,
                message: err.message
            });
        } else {

            versionutil.setModifiedDate('locations', function(err, date) {
                if (err) {
                    return res.send({
                        success: false,
                        message: err.message,
                    });
                } else {
                    return res.send({
                        success: true,
                        message: "Init complete",
                        _id: location._id,
                        modified_since: date
                    });
                }
            })
        }
    });
});

router.delete('/:id', function(req,res){
    Location.findOneAndRemove({_id: req.params.id}, function (err) {
        if (err) {
            return res.send({
                success: false,
                message: err.message
            });
        } else {

            versionutil.setModifiedDate('locations', function(err, date) {
                if (err) {
                    return res.send({
                        success: false,
                        message: err.message,
                    });
                } else {
                    return res.send({
                        success: true,
                        message: "Delete complete",
                        modified_since: date
                    });
                }
            })
        }
    })
});

module.exports = router;
