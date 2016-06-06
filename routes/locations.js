var express = require('express');
var Location = require('../models/Location');
var router = express.Router();
var versionutil = require('../utils/versionutil');

/* GET users listing. */
router.get('/', function (req, res) {

    Location.find({}, function (err, locations) {

        if (!err) {

            return res.send({
                success: true,
                data: locations
            });
        } else {
            console.log(err);
            return res.send({
                success: false,
                message: err.message
            });
        }
    })
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

            versionutil.increaseVersionnumber('locations');
            return res.send({
                success: true,
                message: "Init complete",
                _id: location._id
            });
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
            versionutil.increaseVersionnumber('locations');
            return res.send({
                success: true,
                message: "Post complete",
                _id: location._id
            });
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
            versionutil.increaseVersionnumber('locations');
            return res.send({
                success: true,
                message: "Delete complete"
            });
        }
    })
});

module.exports = router;
