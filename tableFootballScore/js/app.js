var TFS = TFS || {};

/* App Router */
var AppRouter = Backbone.Router.extend({


	routes: {
		"results": "listResults",
		"players": "listPlayers",
		"addresult": "addResult",
		"addplayer": "addPlayer",
		//edit results/players
		"editresult": "editResult",
		"editplayer": "editPlayer",
		"": "listPlayers"
	},
	

	initialize: function() {
		this.results = new TFS.ResultCollecton();
		
		this.players = new TFS.PlayerCollection();

		
		this.resultsView = new TFS.ResultsListView({
			model: this.results
		});

		
		this.playersView = new TFS.PlayerListView({
			model: this.players
		});

		
		this.players.fetch();
		//store name
		var rs = "ResultsStore";
		//result collection
		var rc = this.results;


		if (localStorage.getItem(rs)) {
			rc.localStorage = new Backbone.LocalStorage(rs);
			//fetch will retrieve the localStorage data instead of making a call to the server
			rc.fetch();
		} else {
			rc.fetch().done(function() {
				//once the call is made initialise the storage
				rc.localStorage = new Backbone.LocalStorage(rs);
				//add data to the localStorage
				_.each(rc.models, function(r) {
					//save the results into the browsers localStorage
					r.save()
				});
			});
		}
	},
	

	listPlayers: function() {
		$('#content').html(this.playersView.render().el);

	},
	

	listResults: function() {
		$('#content').html(this.resultsView.render().el);
	},
	

	addPlayer: function() {
		var addPlayerView = new TFS.AddPlayerView();
		
		$('#content').html(addPlayerView.render().el);
	},
	

	addResult: function() {
		var addResultsView = new TFS.AddResultsView({
			model: this.players
		});
		
		$('#content').html(addResultsView.render().el);
	},
	

	editPlayer: function() {
		var editPlayerView = new TFS.EditPlayerView({
			model: this.players
		});
		
		$('#content').html(editPlayerView.render().el);
	},
	

	editResult: function() {
		var editResultsView = new TFS.EditResultsView({
			model: this.results
		});
		
		$('#content').html(editResultsView.render().el);
	},
	

});

/* Models */

//A Player
TFS.Player = Backbone.Model.extend({

});

//A Match result
TFS.Result = Backbone.Model.extend({

});

/* Collections */
TFS.PlayerCollection = Backbone.Collection.extend({
	model: TFS.Player,
	url: "data/players.json"
});



TFS.ResultCollecton = Backbone.Collection.extend({
	model: TFS.Result,
	url: "data/results.json"
});

/* Views */
TFS.AddResultsView = Backbone.View.extend({
	template: _.template($('#resultInput').html()),
	initialize: function() {
		this.model.bind("reset", this.render, this);
	},
	
	//add ui events
	events: {
		"click #addResults": "saveResults",
	},
	

	saveResults: function(e) {
		e.preventDefault();
		
		var saveObj = TFS.validateResults(e.target);
		// display a text message warning and prevent the function from executing 
		if (saveObj.msg) {
			alert(saveObj.msg);
		} else {
			e.target.parentNode.reset();
			TFS.app.results.create(saveObj.resultEntry);
			alert("New result has been added.")
		}
	},
	

	render: function() {
		$(this.el).html(this.template());
		$(this.el).find("#filter1").append(TFS.createPlayerSelect());
		$(this.el).find("#filter2").append(TFS.createPlayerSelect());
		return this;
	}
})

TFS.validateResults = function(t) {
	var o = {
		msg: "",
		resultEntry: {}
	};
	
	var formData = [];
	var selData = [];
	var inputs = $(t).siblings("input");
	var selections = $(t).siblings("div").find("select");
	//checks for a positive integer


	function isNormalInteger(str) {
		var n = ~~Number(str);
		return String(n) === str && n >= 0;
	}

	var l = inputs.length;
	while (l) {
		var el = inputs[l - 1];
		if (isNormalInteger($(el).val())) {
			formData.push($(el).val());
		} else {
			o.msg = "Note: Enter positive numeric value in the Result fields.";
			return o;
		}--l;
	}

	var l = selections.length;
	while (l) {
		var el = selections[l - 1];
		if ($(el).val() !== "" && !~selData.indexOf($(el).val())) {
			selData.push($(el).val());
		} else {
			o.msg = "Please select different players' names from the lists";
			return o;
		}--l;
	}

	o.resultEntry = {
		player1: {
			name: selData[0],
			score: formData[0]
		},
		

		player2: {
			name: selData[1],
			score: formData[1]
		}
	}

	return o;
}


TFS.createPlayerSelect = function() {
	var select = $("<select/>", {
		html: "<option value=''>Select a Player</option>"
	});
	
	_.each(TFS.app.players.models, function(item) {
		var option = $("<option/>", {
			value: item.attributes.firstName,
			text: item.attributes.firstName
		}).appendTo(select);
	});
	
	return select;
}

TFS.AddPlayerView = Backbone.View.extend({
	template: _.template($('#nameInput').html()),

	events: {
		"click #addPlayerName": "saveName",
	},
	

	saveName: function(e) {
		e.preventDefault();
		
		var formData = {
			id: TFS.app.players.length + 1,
		};
		
		var inputs = $(e.target).siblings("input");
		var l = inputs.length;
		while (l) {
			var el = inputs[l - 1];
			if ($(el).val() !== "") {
				formData[el.className] = $(el).val();
			} else {
				alert("Please enter first and last names");
				return false;
			}--l;
		}

		TFS.app.players.add(formData);
		e.target.parentNode.reset();
		
		alert("New player has been added to the list");
	},
	
	render: function() {
		$(this.el).html(this.template());
		return this;
	}

});


TFS.EditPlayerView = Backbone.View.extend({

	template: _.template($('#playerEdit').html()),
	initialize: function() {
		this.model.bind("reset", this.render, this);
	},
	
	//add ui events
	events: {
		"click #editPlayer": "saveResults",
		"change #playerSelect select": "setFilter"
	},
	

	//Set filter property and fire change event
	setFilter: function(e) {
		var selected = $(e.currentTarget).find('option:selected');
		var inputs = $(this.el).find("#playerSelect ~ input");
		$(inputs[0]).val($(selected).attr("data-firstName"));
		$(inputs[1]).val($(selected).attr("data-lastName"));
	},
	

	createGameSelect: function() {
		var select = $("<select/>", {
			html: "<option value=''>Please select</option>"
		});

		
		_.each(this.model.models, function(item) {
			var option = $("<option/>", {
				value: item.attributes.id,
				text: item.attributes.id,
				"data-firstName": item.attributes.firstName,
				"data-lastName": item.attributes.lastName
			}).appendTo(select);
		});
		
		return select;
	},
	

	saveResults: function(e) {
		e.preventDefault();
		
		var selection = $(e.target).siblings("div").find("select").val();
		
		if (!selection) {
			alert("Note: Select a player");
			return false;
		}
		var inputs = $(e.target).siblings("input");
/*
		although we could have used the following loop
		_.each(inputs, function(item) {
			
			})
		*/
		//this loops is much quicker
		var l = inputs.length;
		while (l) {
			if ($(inputs[l - 1]).val() == "") {
				alert("Note: First or last name is blank");
				return false;
			}--l;
		}

		//store ref to model's attributes
		this.model.models[selection - 1].set({
			firstName:$(inputs[0]).val(),
			lastName:$(inputs[1]).val()
		})
		//clear the form
		//native DOM interaction instead of $('form')[0].reset()
		e.target.parentNode.reset();
		alert("Player details have been edited.")
	},
	

	render: function() {
		$(this.el).html(this.template());
		$(this.el).find("#playerSelect").append(this.createGameSelect());
		return this;
	}

});


TFS.EditResultsView = Backbone.View.extend({

	template: _.template($('#resultEdit').html()),
	//add ui events
	events: {
		"click #editResult": "saveResults",
	},
	
	initialize: function() {
		this.model.bind("reset", this.render, this);
		TFS.app.players.bind("reset", this.render, this);
	},
	

	createSelect: function() {
		var select = $("<select/>", {
			html: "<option value=''>Select a game</option>"
		});
		
		var i = 0;
		_.each(this.model.models, function(item) {

			i++;
			var option = $("<option/>", {
				value: i,
				text: i,
				"data-firstPlayer": item.attributes.player1,
				"data-secondPlayer": item.attributes.player2
			}).appendTo(select);
		});
		
		return select;
	},
	

	saveResults: function(e) {
		e.preventDefault();
		
		var selection = $(e.target).siblings("div").find("select").val();
		
		if (!selection) {
			alert("Note: Select a Game");
			return false;
		}

		var saveObj = TFS.validateResults(e.target);

		if (saveObj.msg) {
			alert(saveObj.msg);
			return false;
		}
		//get array item
		selection--;
		//current model
		var m=this.model.models[selection];
		m.id=this.model.localStorage.records[selection]
		m.set({
			player1:saveObj.resultEntry.player1,
			player2:saveObj.resultEntry.player2
		})
		this.model.localStorage.update(m);
		alert("Result entry has been modified");
		e.target.parentNode.reset();
	},
	
	render: function() {
		$(this.el).html(this.template());
		$(this.el).find("#gameSelect").append(this.createSelect());
		$(this.el).find("#filter3").append(TFS.createPlayerSelect());
		$(this.el).find("#filter4").append(TFS.createPlayerSelect());
		return this;
	}
});

TFS.PlayerListView = Backbone.View.extend({
	tagName: "table",
	className: "table table-bordered table-striped",
	initialize: function() {
		this.model.bind("reset", this.render, this);
		//this.model.bind("change", this.render, this);
	},
	render: function(eventName) {
		//clear previous rendering
		$(this.el).empty();
		
		_.each(this.model.models, function(player) {
			$(this.el).append(new TFS.SinglePlayerView({
				model: player
			}).render().el);
		}, this);
		return this;
	}
});

TFS.SinglePlayerView = Backbone.View.extend({
	tagName: "tr",
	template: _.template($('#tpl-player-list-item').html()),
	render: function(eventName) {
		$(this.el).html(this.template(this.model.toJSON()));
		return this;
	}
});

TFS.SingleResultView = Backbone.View.extend({
	tagName: "tr",
	template: _.template($('#tpl-result-list-item').html()),
	render: function(eventName) {
		//result entry
		var re = this.model.toJSON();
		$(this.el).html(this.template(re));
		var sc1 = re.player1.score,
			sc2 = re.player2.score;
		//we can easily see who's won a match because the player name is highlighed
		if (sc1 !== sc2) {
			$(this.el).find("td:contains(" + Math.max(sc1, sc2) + ")").prev().css("background-color", "yellow");
		}
		return this;
	}
});

TFS.ResultsListView = Backbone.View.extend({
	tagName: "table",
	className: "table table-bordered table-striped",
	initialize: function() {
		this.model.bind('change', this.render, this);
	},
	
	render: function(eventName) {
		$(this.el).empty();
		
		_.each(this.model.models, function(wine) {
			$(this.el).append(new TFS.SingleResultView({
				model: wine
			}).render().el);
		}, this);
		return this;
	}
});

TFS.app = new AppRouter();

Backbone.history.start();