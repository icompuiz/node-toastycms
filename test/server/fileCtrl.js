var express = require('express'),
    request = require('supertest'),
    toastyCMS = require('../../server/server');


 var randomString = function random (length) {
 	// body...
 	length = length || 5;
 	return Math.random().toString(36).substring(7).substring(0,length);
 }

describe('FileSystem', function() {
    
    var app;
    var mongoose;

    before(function(done) {
    	
    	if (toastyCMS.app) {
    		app = toastyCMS.app;
    		return done();
    	}

        toastyCMS.run(function(server) {

            app = server;
            // mongoose = require('mongoose');

            done();

        }, {
        	useDb: 'test',
        	mode: 'test',
        	initialize: true
        });

    });

    describe('/api/fs/directories', function(done) {
        it('should respond with the new directmory', function(done) {
        	
        	var directory = {
        		name: randomString()
        	};

            request(app)
                .post('/api/fs/directories', directory)
                .set('Accept', 'application/json')
                .expect(201)
                .expect('Content-Type', /json/)
                .expect(function(res) {
                	if (res.body.name) {
                		if (res.body.name !== directory.name) {
                			return 'directory names don\'t match';
                		}
                	}
                })
                .expect(function(res) {
                	if (!res.body.id) {
            			return 'no id present';
                	}
                })
                .expect(function(res) {
                	if (res.body.acl) {
            			return 'acl field visible';
                	}
                }, done);

        });

    });
});
