/**
 * API tests
 */

// Dependencies
const app = require('./../index');
const assert = require('assert');
const http = require('http');
const config = require('./../lib/config');

// Holder for the tests
var api = {};

// Helpers
var helpers = {};
helpers.makeGetRequest = function (path, callback) {
    // Configure the request details
    var requestDetails = {
        'protocol': 'http:',
        'hostname': 'localhost',
        'port': config.httpPort,
        'method': 'GET',
        'path': path,
        'headers': {
            'Content-Type': 'applicaton/json'
        }
    };

    // Send the request
    var req = http.request(requestDetails, function (res) {
        callback(res);
    });
    req.end();
};


api['app.init should start without throwing'] = function(done) {
    assert.doesNotThrow(function(){
        app.init();
        done();
    }, TypeError);
};

api['/ping should respond to get with 200'] = function(done) {
    helpers.makeGetRequest('/ping', function(res){
        assert.equal(res.statusCode, 200);
        done();
    });
};

api['/api/users should respond to get with 400'] = function(done) {
    helpers.makeGetRequest('/api/users', function(res){
        assert.equal(res.statusCode, 400);
        done();
    });
};


api['A random path should respond to get with 404'] = function(done) {
    helpers.makeGetRequest('/random/path', function(res){
        assert.equal(res.statusCode, 404);
        done();
    });
};



// Export the tests to the runner
module.exports = api;


