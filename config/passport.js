// load all the things we need
// const GoogleStrategy = require('passport-google-oauth20');
const GoogleStrategy = require('passport-google-auth').Strategy;
const passport = require('passport');

// load up the user model
var  User  = require('../models/user');
var  UserFile  = require('../models/userFile');
// load the auth variables
var useFile = false;
var configAuth = require('./auth');

    function extractProfile (profile) {
        return {
            googleid: profile.id,
            displayName: profile.displayName,
            email : profile.emails[0].vallue
        };
    }
    
    passport.use(new GoogleStrategy({
      clientId: process.env.CLIENT_ID || configAuth.googleAuth.clientID,
      clientSecret: process.env.CLIENT_SECRET || configAuth.googleAuth.clientSecret,
      callbackURL: process.env.CALLBACK_URL || configAuth.googleAuth.callbackURL
    }, (accessToken, refreshToken, profile, cb) => {
      
      process.nextTick(function() {

        if(!useFile){

        
        User.findOne({ 'googleId' :  profile.id }, function(err, user) {
          // if there are any errors, return the error
            if (err)
                return cb(err);

            // check to see if theres already a user with that email
            if (user) {
               if(refreshToken){
                  User.findOneAndUpdate( { 'googleId' :  profile.id } , { $set: { refreshToken: refreshToken }}, { new: true }, function (err, user) {
                    if (err) {
                      return handleError(err);
                    }
                    return cb(null, user);
                  });
                }else{
                  return cb(null, user);
                }
            } else {

                user = new User();
                user.googleId = profile.id;
                user.token = accessToken;
                user.refreshToken = refreshToken;

                // save the user
                user.save(function(err) {
                    if (err)
                        throw err;
                    return cb(null, user);
                });
            }

          });
      }else{
          // This is for userthat are safe in a file system 
          // This does not work in Heroku because heroku remove the files
          var user = User.getUser(profile.id);
          if(user){
            if(refreshToken){
              user = User.addUser(profile.id,accessToken,refreshToken);
            }
          }else{
            
            user = User.addUser(profile.id,accessToken,refreshToken);
          }
          cb(null, user);
        }
    });
    }));

    passport.serializeUser((user, cb) => {
      cb(null, user);
    });
    passport.deserializeUser((obj, cb) => {
      cb(null, obj);
    });

module.exports = {
    passport
};