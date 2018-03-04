var {google} = require('googleapis');

var OAuth2 = google.auth.OAuth2;

var  {url, oauth2Client}  = require('../config/googleauth');
var {searchEvents, getLiveMessages, searchBroadcastEvents,getVideoLiveChatId} = require('../google/youtube');
 
module.exports = function(app,passport) {

     app.get('/', function(req, res) {
        if (req.session.user)
        {
            var user = null;
            var videos = null;
            
            user = req.session.user;
            res.render('index.html'); 
        }else{
           res.render('index.html'); 
        }
    });

     app.get('/search', function(req,res) {

        if (!req.session.user)
        {
            res.send("error");
            return;
        }

        var user = req.session.user;
        oauth2Client.setCredentials({
              access_token: user.accessToken,
              refresh_token: user.refreshToken
            });
        let q = req.query.q;
        if(q == null && q == "")
        {
            q = "games";
        }
        let params = {
            'params': {   
                'part': 'id,snippet',
                'type': 'video',
                'q': q,
                'eventType': 'live',
                'videoSyndicated': true,
                'maxResults': 10
            }
        };
        searchEvents(oauth2Client, params , (err,response) =>{
            var videos = response.videos;
            if(videos.lenght <= 0)
            {
                console.log("No existen");
                res.send("No existen");
                return;
            }
            res.jsonp(response);
            
        });
     });
     app.get('/broadcast', function(req,res) {

        if (!req.session.user)
        {
            res.send("error");
            return;
        }

        var user = req.session.user;
        oauth2Client.setCredentials({
              access_token: user.accessToken,
              refresh_token: user.refreshToken
            });

        let params = {
            'params': {   
                'broadcastStatus': 'active',
                'part': 'snippet',
                'type': 'video'
            }
        };
        searchBroadcastEvents(oauth2Client, params , (err,response) =>{
            var videos = response.videos;
            if(videos.lenght <= 0)
            {
                console.log("No existen");
                res.send("No existen");
                return;
            }
            res.jsonp(response);
            
        });
     });

     app.get('/liveChat', function(req, res) {
        if (!req.session.user)
        {
            res.send("error");
            return;
        }
        req.session.user.liveChatId = undefined;
        var user = req.session.user;
        oauth2Client.setCredentials({
              access_token: user.accessToken,
              refresh_token: user.refreshToken
            });
        let params = {
            'params': {   
                'id': req.query.videoId,
                'part': 'snippet,contentDetails,statistics,liveStreamingDetails',
                'type': 'video'
            }
        };
        getVideoLiveChatId(oauth2Client, params , (err,response) =>{
            var videos = response.videos;
            if(videos.lenght <= 0)
            {
                console.log("No existen");
                res.send("No existen");
                return;
            }
            req.session.user.liveChatId = videos[0].liveChatId;
            res.send("OK");
        });
        
    });

    app.get('/messages' , function(req,res) {
        if (!req.session.user || !req.session.user.liveChatId)
        {
            res.status(403).send("error");
            return;
        }
        
        user = req.session.user;
        oauth2Client.setCredentials({
          access_token: user.accessToken,
          refresh_token: user.refreshToken
        });
        var liveChatId = req.session.user.liveChatId;
        var pageToken = req.query.pageToken;
        getLiveMessages(oauth2Client,{
            'params':   {   
                        'liveChatId': liveChatId,
                        'part': 'id,snippet,authorDetails',
                        'pageToken' : pageToken
                        }
        },(err,response) =>{
            if(err)
            {
                console.log(err);
                res.send();
                return;
            }
            res.jsonp(response);
        });
    });

    app.get('/logout', function(req, res) {
        req.session.destroy();
        res.redirect('/');
    });
 
    app.get('/auth/google',  passport.authenticate('google', { 
        scope: ['email', 'profile','https://www.googleapis.com/auth/youtube.readonly',
              'https://www.googleapis.com/auth/youtube',
              'https://www.googleapis.com/auth/youtube.force-ssl',
              'https://www.googleapis.com/auth/plus.login',
              'https://www.googleapis.com/auth/youtube.force-ssl',
              'https://www.googleapis.com/auth/youtubepartner '],
                accessType: 'offline'}));
    
    app.get('/auth/google/callback',  passport.authenticate('google'),
        (req, res) => {

            req.session.user = req.user;
            res.redirect('/?log=true');
        }
    );
    
};
