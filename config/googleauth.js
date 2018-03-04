var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;
 
var configAuth = require('./auth');

var oauth2Client = new OAuth2(
  configAuth.googleAuth.clientID,
  configAuth.googleAuth.clientSecret,
  configAuth.googleAuth.callbackURL
);
 
var scopes = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.force-ssl',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/plus.login',
  'https://www.googleapis.com/auth/youtube.force-ssl',
  'https://www.googleapis.com/auth/youtubepartner'
];


var url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',
 
  // If you only need one scope you can pass it as a string
  scope: scopes,
 
  // Optional property that passes state parameters to redirect URI
  // state: 'foo'
});

module.exports = {
  url, 
  oauth2Client
}