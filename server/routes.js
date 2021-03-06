'use strict';

var _ = require('lodash');
var path = require('path');
var async = require('async');

var routesRegistered = false;



var Authentication = require('./controllers/authenticationCtrl.js');
var Mock = require('./controllers/mock.js');
var Route = require('./controllers/route.js');
var Directory = require('./controllers/directory.js');
var File = require('./controllers/file.js');

var Content = require('./controllers/content.js');
var ContentType = require('./controllers/contentType.js');
var InputFormat = require('./controllers/inputFormat.js');
var OutputFormat = require('./controllers/outputFormat.js');
var Template = require('./controllers/template.js');

var Block = require('./controllers/block.js');
var Script = require('./controllers/script.js');

var Setting = require('./controllers/setting.js');

var ContentManager = require('./controllers/contentManager.js')


var apiRoutes = [{
    path: '/api/mocks',
    controller: Mock
}, {
    path: '/api/fs',
    controller: Directory
},{
    path: '/api/fs/directories',
    controller: Directory
}, {
    path: '/api/fs/files',
    controller: File
}, {
    path: '/api/content',
    controller: Content
}, {
    path: '/api/types',
    controller: ContentType
}, {
    path: '/api/inputformats',
    controller: InputFormat
}, {
    path: '/api/outputformats',
    controller: OutputFormat
}, {
    path: '/api/templates',
    controller: Template
}, {
    path: '/api/blocks',
    controller: Block
}, {
    path: '/api/scripts',
    controller: Script
}, {
    path: '/api/settings',
    controller: Setting
}];

var authRoutes = [{
    path: '/register',
    httpMethod: 'POST',
    middleware: [Authentication.register]
}, {
    path: '/login',
    httpMethod: 'POST',
    middleware: [Authentication.login]
}, {
    path: '/logout',
    httpMethod: 'GET',
    middleware: [Authentication.logout]
}, {
    path: '/me',
    httpMethod: 'GET',
    middleware: [Authentication.currentUser]
}];

var staticRoutes = [{
    path: '/partials/*',
    httpMethod: 'GET',
    middleware: function(req, res) {
        var requestedView = path.join('./', req.url);
        console.log("View::", requestedView);
        res.render(requestedView, function(err, html) {
            if (err) {
                res.render('404');
            } else {
                res.send(html);
            }
        });
    }
}, {
    path: '/',
    httpMethod: 'GET',
    middleware: function(req, res) {
        res.render('404');
    },
}, {
    path: '/management',
    httpMethod: 'GET',
    middleware: function(req, res) {
        res.render('index', {
            user: req.user
        });
    },
}, {
    path: '/management/',
    httpMethod: 'GET',
    middleware: function(req, res) {
        res.render('index', {
            user: req.user
        });
    },
}, {
    path: '/management/*',
    httpMethod: 'GET',
    middleware: function(req, res) {
        res.render('index', {
            user: req.user
        });
    },
}];

var contentRoutes = [{
    path: '/:contentId([0-9a-fA-F]{24})',
    httpMethod: 'GET',
    middleware: [ContentManager.viewById]
}, {
    path: '/*',
    httpMethod: 'GET',
    middleware: [ContentManager.viewByPath]
}];



function cleanRequest(req, res, next) {
    if (req.user) {
        if (req.user.salt) {
            req.user.salt = null;
        }
        if (req.user.hash) {
            req.user.hash = null;
        }
    }
    next();
}

function main(app, afterRoutesRegistered) {

    if (routesRegistered) {
        console.log('Routes have already been registered');
        return;
    }

    routesRegistered = true;

    function registerRoute(route, afterRegisterRoute) {

        console.log('Registering', route.path);

        if (!_.isArray(route.middleware)) {

            route.middleware = [route.middleware];

        }

        // route.middleware.unshift(setUser);
        route.middleware.unshift(cleanRequest);


        var args = _.flatten([route.path, route.middleware]);

        switch (route.httpMethod) {
            case 'GET':
                app.get.apply(app, args);
                break;
            case 'POST':
                app.post.apply(app, args);
                break;
            case 'PUT':
                app.put.apply(app, args);
                break;
            case 'DELETE':
                app.delete.apply(app, args);
                break;
            default:
                var err = new Error('Invalid method specified for route ' + route.path);
                return afterRegisterRoute(err);
        }

        afterRegisterRoute();

    }

    function registerAuthRoutes(afterRegisterAuthRoutes) {

        async.each(authRoutes, registerRoute, afterRegisterAuthRoutes);

    }

    function registerStaticRoutes(afterRegisterStaticRoutes) {

        async.each(staticRoutes, registerRoute, afterRegisterStaticRoutes);

    }

    function registerAPIRoutes(afterRegisterAPIRoutes) {

        async.each(apiRoutes, function(route, afterRegisterRoute) {

            console.log('Registering route', route.path);

            route.controller.resource
                .before('get', Route.checkRoute)
                .before('post', Route.checkRoute);

            route.controller.register();

            route.controller.resource
                .after('get', cleanRequest)
                .after('post', cleanRequest)
                .after('put', cleanRequest)
                .after('delete', cleanRequest);

            route.controller.resource.register(app, route.path);

            afterRegisterRoute();

        }, afterRegisterAPIRoutes);

    }

    function registerContentRoutes(afterRegisterContentRoutes) {

        async.each(contentRoutes, registerRoute, afterRegisterContentRoutes);


    }

    async.series({

        registerAuthRoutes: registerAuthRoutes,
        registerStaticRoutes: registerStaticRoutes,
        registerAPIRoutes: registerAPIRoutes,
        registerContentRoutes: registerContentRoutes

    }, afterRoutesRegistered);

}

module.exports = {
    apiRoutes: apiRoutes,
    authRoutes: authRoutes,
    staticRoutes: staticRoutes,
    register: main
};
