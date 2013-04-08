define(['jquery', 'underscore', 'backbone', 'https://www.google.com/jsapi'], function($, _, Backbone) {

	var ResultsListView = Backbone.View.extend({
		template: _.template($('#lineChart').html()),
		onTimerTick: function() {
			//removes the first row
			this.data.removeRow(0);
			//static var x is a tick counter
			this.x || (this.x = this.data.getNumberOfRows() + 1);
			this.x++;
			// Generating a random a, b pair and inserting it so rows are sorted.
			var a = Math.floor(Math.random() * 100);
			var b = Math.floor(Math.random() * 100);
			//adds extra row
			this.data.insertRows(this.data.getNumberOfRows(), [
				[this.x.toString(), a, b]
			]);
			this.chart.draw(this.data, this.options);
		},
		

		render: function() {
			google.load('visualization', '1', {
				'callback': _.bind(this.drawVisualization, this),
				'packages': ['corechart']
			});
			
			return this;
		},
		

		drawVisualization: function() {
			this.data = new google.visualization.DataTable(this.model.models[0].attributes);
			//In draw visualization
			this.options = {
				animation: {
					duration: 800,
					easing: 'out',
				},
				
				vAxis: {
					minValue: 0,
					maxValue: 100
				}
			}
			$(this.el).html(this.template());
			this.chart = new google.visualization.LineChart(this.$('#lc').get(0));
			this.chart.draw(this.data, this.options);

		}
	});
	// Our module now returns our view
	return ResultsListView;
});