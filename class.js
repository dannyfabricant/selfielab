var Twit = require('twit');
var config = require('./config');

var T = new Twit(config);

var exec = require('child_process').exec;
var fs = require('fs');

exec('processing-java --sketch='pwd'/drawit', processing);

function processing() {
	var filename = 'drawit/drawing.png';
	var params = {
		encoding: 'base64'
	}

	var b64 = fs.readFileSync(filename, params);

	T.post('media/upload', {media_date: b64}, uploaded);
}

function uploaded() {
	var params = {
		status: 'HA!',
		media_ids: [data.media_id_string]
	}

	T.post('statuses/update', params, tweeted);
}

function searchtweet() {
	var params = {
	  q: 'rainbow!',
	  count: 2,
	}

	T.get('search/tweets', params, gotData); //call back function. gotData is run only when search tweets has happened.

	function gotData(err, data, response) {
	  var tweets = data.statuses;
	  for (var i = 0; i < tweets.length; i++) {
	    console.log(tweets[i].text);
	  }
	}
}

function tweetit (argument) {
	var parameters = {
		status: 'I am bot!'
	}

	T.post('statuses/update', parameters, tweeted);
}

function tweeted(err, data, response) {
		if(err) {
			console.log('Something went wrong!');
		} else {
			console.log('It worked!');
		}
	}