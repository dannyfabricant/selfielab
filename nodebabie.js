var config = require('./config');
var Twit = require('twit');
var T = new Twit(config);
var exec = require('child_process').exec;
var fs = require('fs');
var request = require('request');
var cv = require("opencv");

var imgurls = [];
var usernames = [];
var filenames = [];
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
		if (err) {
			console.log("Something went wrong!");
			console.log(err);
		} else {
			console.log("searching tweets");
		}
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
		} else {
			console.log(imgurls);
			downloadImgs();
		}
	});
}

function downloadImgs() {
	var faces = 0;

	for (var i = imgurls.length - 1; i >= 0; i--) {
		var download = function(uri, filename, callback){
		  request.head(uri, function(err, res, body){
		    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
		  });
		};

		var filename = "images/in/image_" + String(i) + ".jpg";
		filenames.push(filename);

		download(imgurls[i], filename, function(){
		  console.log("%s downloaded", filename);
		});
	}

	setTimeout( function () {
		detectFaces();
	}, 2000);

}

var coordinates = [];
function detectFaces() {
	for (var i = filenames.length - 1; i >= 0; i--) {
		cv.readImage(filenames[i], function(err, im){
		  im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
		    for (var i=0;i<faces.length; i++){
		      var x = faces[i]
		      coordinates.push({x: x.x, y: x.y, width: x.width, height: x.height});
		    }
		  });
		});
	}
	setTimeout( function () {
		console.log(coordinates);
	}, 2000);
}




function upload() {
	var filename = 'faceswap2/selfiebaby.jpg';
  	var params = {
    	encoding: 'base64'
  	}
    var b64 = fs.readFileSync(filename, params);

    // setTimeout(function() {
    	T.post('media/upload', { media_data: b64 }, tweet);
    // }, 5000);
}

function tweet(err, data, response) {
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
		console.log("tweet posted!");
	}
}