var express = require('express'),
	request = require('supertest');

describe('GET /api/mock', function() {
	it('respond with json', function(done) {

		function onReady(app) {
			request(app)
				.get('/api/mock')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done);
		}

		require('../../server/server')(onReady);

	});

});
