var express = require('express'),
    request = require('supertest'),
    toastyCMS = require('../../server/server');


var randomString = function random(length) {
    // body...
    length = length || 5;
    return Math.random().toString(36).substring(7).substring(0, length);
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
            // initialize: true
        });

    });

    describe('/api/fs/directories', function(done) {

        var directory = {
            name: randomString()
        };

        it('should respond with the new directory', function(done) {


            request(app)
                .post('/api/fs/directories', directory)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(function(res) {
                    if (!res.body._id) {
                        return 'no id present';
                    }

                    directory._id = res.body._id;
                })
                .expect(201, done);

        });

        it('should not have an acl property', function(done) {

        	request(app)
                .get('/api/fs/directories/' + directory._id)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(function(res) {
                    if (res.body.acl) {
                        return 'acl field visible';
                    }
                })
                .expect(200, done);

        });



    });
});
