// JavaScript Document
// Filename: main.js

// Require.js allows us to configure shortcut alias
require.config({
	paths: {
		jquery: 'libs/jquery',
		underscore: 'libs/underscore',
		backbone: 'libs/backbone'
	},
	
	shim: {
		underscore: {
			exports: "_"
		},
		
		backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		}
	}
});

require([
// Load our app module and pass it to our definition function
'app', ], function(App) {
	// The "app" dependency is passed in as "App"
	App.initialize();
});