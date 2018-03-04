var {google} = require('googleapis');

function removeEmptyParameters(params) {
  for (var p in params) {
    if (!params[p] || params[p] == 'undefined') {
      delete params[p];
    }
  }
  return params;
}


var searchEvents = function (auth, requestData,cb) {
  var service = google.youtube('v3');
  var parameters = removeEmptyParameters(requestData['params']);
  parameters['auth'] = auth;
  service.search.list(parameters, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      cb(err);
      return;
    }
    var videos = response.data.items.map( (video) => {
    	return {
    		url: 'https://www.youtube.com/watch?v='+video.id.videoId,
    		id: video.id,
    		channelId : video.snippet.channelId,
    		title: video.snippet.title
    	};

    });

    var searchInfo = {
    	videos : videos,
    	nextPageToken: response.data.nextPageToken,
    	prevPageToken: response.data.prevPageToken,
    	totalResults:  response.data.pageInfo.totalResults,
    	resultsPerPage:  response.data.pageInfo.resultsPerPage
    };
    	cb(null,searchInfo);
  });
}

var searchBroadcastEvents = function (auth, requestData,cb) {
  var service = google.youtube('v3');
  var parameters = removeEmptyParameters(requestData['params']);
  parameters['auth'] = auth;
  service.liveBroadcasts.list(parameters, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      cb(err);
      return;
    }
    var videos = response.data.items.map( (video) => {
    	return {
    		url: 'https://www.youtube.com/watch?v='+video.id,
    		id: video.id,
    		liveChatId : video.snippet.liveChatId
    	};

    });

    var searchInfo = {
    	videos : videos,
    	nextPageToken: response.data.nextPageToken,
    	prevPageToken: response.data.prevPageToken,
    	totalResults:  response.data.pageInfo.totalResults,
    	resultsPerPage:  response.data.pageInfo.resultsPerPage
    };
    	cb(null,searchInfo);
  });
}

var getLiveMessages = function (auth, requestData,cb)
{
	var service = google.youtube('v3');
	var parameters = removeEmptyParameters(requestData['params']);
	parameters['auth'] = auth;
	service.liveChatMessages.list(parameters, function(err, response) {
	    if (err) {
	      console.log('The API returned an error: ' + err);
	      cb(err);
	      return;
	    }
	   
		var messages = response.data.items.map( (message) => {
			var messageText = (message.snippet.type == "textMessageEvent") ? message.snippet.textMessageDetails.messageText: ""; 
	    	return {
	    		id: message.id,
	    		authorId: message.authorDetails.channelId,
	    		displayName: message.authorDetails.displayName,
	    		textMessageDetails: messageText
	    	};
	    });

	    
	    var searchInfo = {
	    	messages : messages,
	    	nextPageToken: response.data.nextPageToken,
	    	totalResults:  response.data.pageInfo.totalResults,
	    	resultsPerPage:  response.data.pageInfo.resultsPerPage,
	    	pollingIntervalMillis: response.data.pollingIntervalMillis
    	};
	    cb(null,searchInfo);
	});
};

var getVideoLiveChatId = function (auth, requestData,cb){
	var service = google.youtube('v3');
	var parameters = removeEmptyParameters(requestData['params']);
	parameters['auth'] = auth;
	service.videos.list(parameters, function(err, response) {
	    if (err) {
	      console.log('The API returned an error: ' + err);
	      cb(err);
	      return;
	    }
	    var videos = response.data.items.map( (video) => {
	    	return {
	    		id: video.id,
	    		liveChatId: video.liveStreamingDetails.activeLiveChatId
	    	};
	    });
	    var searchInfo = {
	    	videos : videos
    	};
	    cb(null,searchInfo);
	});
};

var pushLiveMessage = function (auth, requestData,cb){
	var service = google.youtube('v3');
	var parameters = removeEmptyParameters(requestData['params']);
	parameters['auth'] = auth;
	service.liveChatMessages.insert(parameters, function(err, response) {
	    if (err) {
	      console.log('The API returned an error: ' + err);
	      cb(err);
	      return;
	    }
	    console.log(response.data.items[0].authorDetails);
	    var messages = response.data.items.map( (message) => {
	    	return {
	    		id: message.id,
	    		authorId: message.authorDetails.channelId,
	    		displayName: message.authorDetails.displayName,
	    		textMessageDetails: message.snippet.textMessageDetails
	    	};
	    });

      
	    var searchInfo = {
	    	messages : messages,
	    	pollingIntervalMillis: pollingIntervalMillis,
	    	nextPageToken : nextPageToken
		};
	    cb(null,searchInfo);
	});
};

module.exports = {
	searchEvents,
	getLiveMessages,
	searchBroadcastEvents,
	pushLiveMessage,
	getVideoLiveChatId
}