'use strict';

var pubUser = {
		users: [{
				username: 'public',
				access: {
						read: true,
						create: true
				}
		}]
};

var pub = {
		groups: [{
				name: 'public',
				access: {
						read: true,
						create: true
				}
		}]
};

var users = {
		groups: [{
				name: 'users',
				access: {
						read: true,
						create: true
				}
		}]
};

var admin = {
		groups: [{
				name: 'administrators',
				access: {
						read: true,
						create: true
				}
		}]
};

var all = [admin, users, pub];

var assets = [{
				name: '/admin',
				items: [admin]
		}, {
				name: '/users',
				items: [admin, users]
		}, {
				name: '/public',
				items: all
		}, {
				name: '/login',
				items: [pub]
		}, {
				name: '/logout',
				items: [admin, users]
		}, {
				name: '/api/mocks',
				items: [pub]
		}, {
				name: '/api/fs/directories',
				items: [admin, users]
		}, {
				name: '/api/fs/files',
				items: [admin, users]
		}, {
				name: '/api/content',
				items: [admin, users]
		}, {
				name: '/api/types',
				items: [admin, users]
		}, {
				name: '/api/inputformats',
				items: [admin, users]
		}, {
				name: '/api/outputformats',
				items: [admin, users]
		}, {
				name: '/api/templates',
				items: [admin, users]
		}, {
				name: '/api/blocks',
				items: [admin, users]
		}, {
				name: '/api/scripts',
				items: [admin, users]
		}, {
				name: '/api/settings',
				items: [admin, users]
		}
];

module.exports = {
		data: assets
};
