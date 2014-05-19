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
},{
	username: 'special',
	password: 'special',
	fullname: 'special User',
	email: 'special@email.com',
	options: {
		groups: [
			'administrators',
			'users',
		]
	}
}];

module.exports = {
	root: root,
	administrator: administrator,
	all: users
};
