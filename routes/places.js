/**
 * Created by tranvietthang on 6/17/16.
 */

var express = require('express');
var request = require('request');
var config = require('../config');

var router = express.Router();


router.get('/:id', function (req, res) {
    var placeId = req.params.id;

    getPlaceDetails(placeId, function (err, detialsBody) {
        if (err) {
            console.log(err);
            return res.send({
                success: false,
                message: err
            })
        }
    })
});

router.get('/:id/reviews', function (req, res) {
    var placeId = req.params.id;

    getPlaceDetails(placeId, function (err, details) {
        if (err) {
            return res.send({
                success: false,
                message: err
            })
        } else {
            getNearByPlaces(
                {
                    lat: details.result.geometry.location.lat,
                    lng: details.result.geometry.location.lng
                },
                function (err, places) {

                    if (err) {
                        return res.send({
                            success: false,
                            message: err
                        })
                    } else {
                        return res.send({
                            success: true,
                            data: {
                                reviews: details.reviews,
                                nearby_plcaes: places.results
                            }
                        })
                    }

                }
            )
        }
    })
});


var getPlaceDetails = function (placeId, next) {
    request({
        url: 'https://maps.googleapis.com/maps/api/place/details/json',
        qs: {
            placeid: placeId,
            key: config.google.PLACE_API_KEY
        },
        method: 'GET'
    }, function (err, placeRes, placeBody) {

        if (placeRes.statusCode != 200) {
            err = "Can't get detail"
        }
        next(err, placeBody);
    })
};

var getNearByPlaces = function (location, next) {
    request({
        url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
        qs: {
            key: config.google.PLACE_API_KEY,
            location: location.lat + "," + location.lng,
            radius: 5000
        },
        method: 'GET'
    }, function (err, placesRes, placesBody) {

        if (placesRes.statusCode != 200) {
            err = "Can't get nearby places"
        }
        next(err, placesBody);
    })
};

module.exports = router;
