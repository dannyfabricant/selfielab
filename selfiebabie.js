var config = require('./config');
var Twit = require('twit');
var T = new Twit(config);
var exec = require('child_process').exec;
var fs = require('fs');

var imgurls = [];
var usernames = [];
var postnames;
var forfile;
var namefile;

var interval = (1000*60)*15;

setInterval(function() {
	start();
}, interval);
start();

function start() {
	imgurls = [];
	usernames = [];
	T.get('search/tweets', { q: '#selfie', count: 60, result_type: 'recent' }, function (err, data, response){
		// console.log(data.statuses[3].entities.media[0].media_url); //this works
		// console.log(data.statuses[1].user.screen_name);
		for (var i = 0; i < data.statuses.length; i++) {
			if (data.statuses[i].entities.media) {
				var url = data.statuses[i].entities.media[0].media_url
				var username = data.statuses[i].user.screen_name;
				imgurls.push(url);
				usernames.push(username);
			}
		}
		if (imgurls.length < 10) {
			console.log(imgurls.length);
			delay(10000);
			start();
		} else {
			forfile = imgurls.join();
			forfile = forfile.replace(/,/g, '\n');
			namefile = usernames.join();
			namefile = namefile.replace(/,/g, '\n');
			
			fs.writeFile("faceswap2/data/usernames.txt", namefile, function(err) {
			    if(err) {
			        return console.log(err);
			    }
			    console.log("name file saved!");
			    fs.writeFile("faceswap2/data/list.txt", forfile, function(err) {
				    if(err) {
				        return console.log(err);
				    }
				    console.log("urls saved!");
			    	var cmd = 'processing-java --sketch=`pwd`/faceswap2 --run';
					exec(cmd, upload);
				});
			});
		}
	});
}

function upload() {
	var filename = 'faceswap2/selfiebaby.jpg';
  	var params = {
    	encoding: 'base64'
  	}
    var b64 = fs.readFileSync(filename, params);

    // setTimeout(function() {
    	T.post('media/upload', { media_data: b64 }, uploaded);
    // }, 5000);
}

function uploaded(err, data, response) {
	fs.readFile('faceswap2/usednames.txt', function(err, f){
	    postnames = f.toString().split('\n');
	    var id = data.media_id_string;
		var tweet = {
			status: 'Hey @'+postnames[0]+' @'+postnames[1]+' we mixed your DNA. This is what your #selfiebabie looks like!',
			// status: 'We mixed your DNA. This is what your #selfiebabie looks like.',
			media_ids: [id]
		}
		T.post('statuses/update', tweet, tweeted);
	});
}

function tweeted(err, data, response) {
	if (err) {
		console.log("Something went wrong!");
		console.log(err);
	} else {
		console.log("It worked!");
	}
}