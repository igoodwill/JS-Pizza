(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by chaika on 09.02.16.
 */
var API_URL = "http://localhost:5050";

function backendGet(url, callback) {
    $.ajax({
        url: API_URL + url,
        type: 'GET',
        success: function(data){
            callback(null, data);
        },
        error: function() {
            callback(new Error("Ajax Failed"));
        }
    })
}

function backendPost(url, data, callback) {
    $.ajax({
        url: API_URL + url,
        type: 'POST',
        contentType : 'application/json',
        data: JSON.stringify(data),
        success: function(data){
            callback(null, data);
        },
        error: function() {
            callback(new Error("Ajax Failed"));
        }
    })
}

exports.getPizzaList = function(callback) {
    backendGet("/api/get-pizza-list/", callback);
};

exports.createOrder = function(order_info, callback) {
    backendPost("/api/create-order/", order_info, callback);
};

},{}],2:[function(require,module,exports){
var api = require('./API');

$(function () {

    var inputs = ['Name', 'Phone', 'Address'].reduce((res, key) => {
        return {
            ...res,
            [key.toLowerCase()]: (name => {
                var group = $(`.${name.toLowerCase()}-group`);
                var field = group.find(`#input${name}`);
                var error = group.find('.help-box');

                return { group, field, error };
            })(key)
        };
    }, {});

    function validate({ group, field, error }) {
        if (field[0].validity.valid) {
            group.removeClass('has-error');
            group.addClass('has-success');
            error.attr('hidden', 'hidden');
        } else {
            group.removeClass('has-success');
            group.addClass('has-error');
            error.removeAttr('hidden');
        }
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

        console.log(result)
        if (result) {
            api.createOrder(result);
        }
    });

});
},{"./API":1}]},{},[2]);
