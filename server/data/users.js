var root = {
	username: 'root',
	password: 'doesnt matter this user will never authenticate',
	fullname: 'root user',
	email: 'no value',
	options: {
		type: 'system',
		nologon: true
	}
};
var administrator = {
	username: 'administrator',
	password: 'password',
	fullname: 'Administrator',
	email: 'no value',
	options: {
		type: 'system'
	}
};

var pub = {
	username: 'public',
	password: 'public',
	fullname: 'public',
	email: 'public@email.com',
	options: {
		type: 'system',
		nologon: true,
		groups: [
			'public'
		],
	}
}

var users = [{
	username: 'basic',
	password: 'basic',
	fullname: 'Basic User',
	email: 'basic@email.com',
	options: {
		groups: [
			'users'
		]
	}
}];

module.exports = {
	root: root,
	administrator: administrator,
	'public': pub,
	all: users
};
