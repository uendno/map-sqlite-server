/**
 * Created by tranvietthang on 6/17/16.
 */

var express = require('express');
var request = require('request');
var config = require('../config');

var router = express.Router();


router.get('/:id', function (req, res) {
    var placeId = req.params.id;
    
    request({
        url: 'https://maps.googleapis.com/maps/api/place/details/json',
        qs: {
            placeid: placeid,
            key: config.google.PLACE_API_KEY
        },
        method: 'GET'
    }, function (googleErr, googleRes, googleBody) {
        if (googleErr) {
            console.log(googleErr);
            return res.send({
                success: false,
                message: "Request failed"
            })
        } else {
            if (googleRes.statusCode!=200) {
                return res.send({
                    success: false,
                    message: "Request failed"
                })
            } else {
                return res.send({
                    success: false,
                    message: "Request successfully",
                    data: googleBody
                })
            }
        }
    })
    
});

module.exports = router;
