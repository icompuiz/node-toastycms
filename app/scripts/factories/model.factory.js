/* globals _: true, define: true */

define(['./module'], function (factories) {
	'use strict';

	factories.factory('ModelFactory', ['EndpointFactory', function(EndpointFactory) {

		function Model(Endpoint) {
			

			var _this = this;

			// publics
			_this.current = null;

			function initialize(defaultModel) {
				
				if (defaultModel) {
					defaultModel = _.clone(defaultModel);
				} else {
					defaultModel = {};
				}

				_this.current = defaultModel;
				return _this.current;
			}

			_this.init = initialize;

			_this.reset = function reset() {
				_this.current = null;
			};

			_this.create = function create(resetOnSuccess, makeCurrent) {

				if (!_this.current._id) {
					var promise = Endpoint.endpoint.post(_this.current);

					if (resetOnSuccess) {
						promise.then(function() {
							_this.reset();
						});
					} else if (makeCurrent) {
						promise.then(function(data) {
							_this.current = data;
						});
					}

					return promise;

				}

				return false;

			};

			_this.read = function read(studentId, options, makeCurrent) {
				var promise = Endpoint.endpoint.one(studentId).get(options);

				if (makeCurrent) {

					promise.then(function(result) {

						_this.current = result;

					});

				}

				return promise;
			};

			_this.update = function update(options, beforeSave, makeCurrent) {
				
				beforeSave = beforeSave || angular.noop;

				if (_this.current._id && _.isFunction(_this.current.put)) {

					var clone = _this.current.clone();

					beforeSave(clone);

					var promise = clone.put(options);

					if (makeCurrent) {
						promise.then(function(data) {
							_this.current = data;
						});
					}


					return promise;
				}
				return false;
			};

			_this.remove = function remove(options) {

				if (_this.current._id && _.isFunction(_this.current.remove)) {
					var promise = _this.current.remove(options);
					
					promise.then(function() {
						_this.reset();
					});

					return promise;
				}
				return false;

			};

			_this.list = function list(options) {
				return Endpoint.endpoint.getList(options);
			};

			_this.save = function save(beforeSave, makeCurrent) {

				var promise = false;
				if (_this.current) {

					if (_this.current._id) {
						// put (update)
						promise = _this.update(null, beforeSave, makeCurrent);
					} else {
						// post (new)
						promise = _this.create(false, makeCurrent);
					}

				}

				return promise;

			};

		}
		
		return {
			create: function create(endpointName, defaults) {
				var endpoint = EndpointFactory.create(endpointName);
				return new Model(endpoint, defaults);
			}
		};

	}]);

});