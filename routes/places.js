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
                                reviews: details.result.reviews,
                                nearby_places: places.results
                            }
                        })
                    }

                }
            )
        }
    })
});

router.get('/direct', function (req, res) {

    var originId = req.query.origin;
    var destinationId = req.query.destination;

    return res.send("origin: " + originId +", destination: " + destinationId);

    request({
        url: 'https://maps.googleapis.com/maps/api/directions/json',
        qs: {
            origin: "place_id:" + originId,
            destination: "place_id:" + destinationId,
            key: config.google.PLACE_API_KEY
        },
        method: 'GET'
    }, function (err, directionRes, directionBody) {

       if (err) {
           return res.send({
               success: false,
               message: err
           })
       } else {
           return res.send({
               success: true,
               data: directionBody
           })
       }
    })

});


router.get('/photo/:id', function(req, res) {
    var photoRef = req.params.id;
    
    getPlacePhoto(photoRef, function (err, body) {
        if (err) {
            return res.send({
                success: false,
                message: err
            })
        } else {
            res.set('Content-Type', 'image/png');
            return res.send(body);
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

        console.log("details body: " + JSON.parse(placeBody));

        next(err, JSON.parse(placeBody));
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

        console.log("nearby places body: " + JSON.parse(placesBody));

        next(err, JSON.parse(placesBody));
    })
};

var getPlacePhoto = function(photoRef, next) {

    var requestSettings = {
        url: 'https://maps.googleapis.com/maps/api/place/photo',
        qs: {
            key: config.google.PLACE_API_KEY,
            photoreference: photoRef,
            maxwidth: 400
        },
        method: 'GET',
        encoding: null
    };

    request(requestSettings, function(err, photoRes, photoBody) {

        if(photoRes.statusCode != 200) {
            err = "Can't get nearyby places"
        }
        var requestSettings = {
            url: 'https://maps.googleapis.com/maps/api/place/photo',
            qs: {
                key: config.google.PLACE_API_KEY,
                photoreference: photoRef,
                maxwidth: 400
            },
            method: 'GET',
            encoding: null
        };

        request(requestSettings, function(err, photoRes, photoBody) {

            if(photoRes.statusCode != 200) {
                err = "Can't get nearyby places"
            }
            
            next(err, photoBody)
        });

        next(err, photoBody)
    })
};

module.exports = router;
