define(['jquery', 'underscore', 'backbone', 'router' // Request router.js
], function($, _, Backbone, Router) {
	console.log($, _, Backbone, Router, _.has)
	var initialize = function() {

		// Pass in our Router module and call it's initialize function
		Router.initialize();

	}

	return {
		initialize: initialize
	};
});