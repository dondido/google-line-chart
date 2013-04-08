define(['jquery', 'underscore', 'backbone', 'views/titleListView', 'views/resultsListView'], function($, _, Backbone, AboutListView, ResultsListView) {
	//Define Namespace (RL shorthand for report list)
	var RL = RL || {};

	/* App Router */
	var AppRouter = Backbone.Router.extend({

		routes: {
			"about": "listAbout",
			"reports": "listReports",
			"": "listAbout"
		},
		

		initialize: function() {
			this.about = new RL.AboutCollection();
			
			this.lineChart = new RL.ChartCollection();
			
			this.lineChart.fetch();
			
			this.aboutView = new AboutListView({
				model: this.about
			});
			
			this.resultsView = new ResultsListView({
				model: this.lineChart
			});
		},
		

		listAbout: function() {
			window.clearInterval(this.interval)
			$('#content').html(this.aboutView.render().el);
		},
		

		listReports: function() {
			this.interval = window.setInterval(_.bind(this.resultsView.onTimerTick, this.resultsView), 1000);
			$('#content').html(this.resultsView.render().el);
		}

	});


	//Models
	//A About
	RL.About = Backbone.Model.extend({});

	// Collections 
	RL.AboutCollection = Backbone.Collection.extend({
		model: RL.About
	});

	// Collections 
	RL.ChartCollection = Backbone.Collection.extend({
		model: RL.About,
		url: "data/lineChart.json"
	});


	
	var initialize = function() {
		RL.app = new AppRouter();
		
		Backbone.history.start();
	}
	return {
		initialize: initialize
	};
});