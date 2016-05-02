
var config = require('./config');
var Twit = require('twit');
var T = new Twit(config);

T.get('search/tweets', { q: 'banana since:2011-07-11', count: 100 }, function(err, data, response) {
  	for (var i = 0; i < data.length; i++) {
		console.log(data[i]);
		// console.log(data[i].entities.media[0].media_url);
	};
})