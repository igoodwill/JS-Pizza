var api = require('./API');

$(function () {

    var $time = $('#time');
    var $address = $('#address');

    function getInput(name) {
        var group = $(`.${name.toLowerCase()}-group`);
        var field = group.find(`#input${name}`);
        var error = group.find('.help-box');

        return { group, field, error };
    }

    var inputs = ['Name', 'Phone'].reduce((res, key) => {
        return {
            ...res,
            [key.toLowerCase()]: getInput(key)
        };
    }, {});

    var addressInput = getInput('Address');
    var addressField = addressInput.field;

    function makeValid(group, error) {
        group.removeClass('has-error');
        group.addClass('has-success');
        error.attr('hidden', 'hidden');
    }

    function makeInvalid(group, error) {
        group.removeClass('has-success');
        group.addClass('has-error');
        error.removeAttr('hidden');
    }

    function validate({ group, field, error }) {
        if (field[0].validity.valid) {
            makeValid(group, error)
        } else {
            makeInvalid(group, error)
        }
    }

    function makeAddressInvalid() {
        $time.text('невідомий');
        $address.text('невідома');
        makeInvalid(addressInput.group, addressInput.error);
        addressInput.valid = false;
    }

    Object.keys(inputs).forEach(key => {
        var input = inputs[key];
        input.field.on('input', () => validate(input));
    });

    $('#next').click(() => {
        var result = Object.keys(inputs).reduce((res, key) => {
            var input = inputs[key];
            var field = input.field[0];

            validate(input);
            if (res && field.validity.valid) {
                return { ...res, [key]: field.value };
            }
        }, {})

        validateAddress();

        if (result) {
            if (addressInput.valid) {
                api.createOrder({ ...result, address: $address.text() });
            }
        }
    });

    var validateAddress;

    google.maps.event.addDomListener(window, 'load', () => {
        var mapProp = {
            center: new google.maps.LatLng(50.464379, 30.519131),
            zoom: 11
        };

        var html_element = document.getElementById("googleMap");
        var map = new google.maps.Map(html_element, mapProp);

        var point = new google.maps.LatLng(50.464379, 30.519131);
        new google.maps.Marker({
            position: point,
            map: map,
            icon: "assets/images/map-icon.png"
        });

        var directionService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(map);

        function calculateRoute(A_latlng, B_latlng) {
            directionService.route({
                origin: A_latlng,
                destination: B_latlng,
                travelMode: google.maps.TravelMode["DRIVING"]
            }, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    var leg = response.routes[0].legs[0];
                    $time.text(leg.duration.text);
                    $address.text(leg.end_address);

                    makeValid(addressInput.group, addressInput.error);
                    addressInput.valid = true;

                    directionsDisplay.setDirections(response);
                }
            });
        };

        var geocoder = new google.maps.Geocoder();

        validateAddress = () => {
            if (addressField[0].value) {
                geocoder.geocode({ 'address': addressField.val() }, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK && results[0]) {
                        calculateRoute(point, results[0].geometry.location);
                    } else {
                        makeAddressInvalid();
                    }
                });
            } else {
                makeAddressInvalid();
            }
        }
        addressField.on('input', validateAddress);

        google.maps.event.addListener(map, 'click', function (me) {
            var coords = me.latLng;
            geocoder.geocode({ 'location': coords }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK && results[1]) {
                    var address = results[1].formatted_address;

                    addressField.val(address);
                    validate(addressInput);
                    calculateRoute(point, coords);
                }
            });
        });
    });
});