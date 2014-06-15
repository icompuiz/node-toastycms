var express = require('express'),
    request = require('supertest'),
    toastyCMS = require('../../server/server');

describe('Mock', function() {
    var app;

    before(function(done) {

    	if (toastyCMS.app) {
    		app = toastyCMS.app;
    		return done();
    	}

        toastyCMS.run(function(server) {

            app = server;

            done();

        }, {
        	useDb: 'test',
        	mode: 'test',
        	initialize: true
        });

    });

    describe('GET /api/mocks', function() {
        it('respond with json', function(done) {

            request(app)
                .get('/api/mocks')
                .set('Accept', 'application/json')
                .expect(function(res) {
                	console.log(res.body);
                })
                .expect('Content-Type', /json/)
                .expect(200, done);


        });

    });
});
