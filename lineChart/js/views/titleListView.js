define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {

	var TitleListView = Backbone.View.extend({
		initialize: function() {
			this.model.bind("reset", this.render, this);
		},
		

		template: _.template($('#aboutApp').html()),
		render: function(e) {
			$(this.el).html(this.template());
			return this;
		}
	});
	// Our module now returns our view
	return TitleListView;
});




