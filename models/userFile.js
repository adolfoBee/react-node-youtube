const fs = require('fs');

var fetchUsers = () =>{
    try{
        var notesString = fs.readFileSync('users-data.json');
        return JSON.parse(notesString);
    } catch(e){
        return [];
    }
};

var saveUsers = (users) => {
    fs.writeFileSync('users-data.json',JSON.stringify(users));
};

var addUser = (googleId, token,refreshToken) => {
    if(getUser(googleId)){
        removeUser(googleId);
    }
    var users = fetchUsers();
    var user = {
        googleId,
        token,
        refreshToken
    };
    users.push(user);
    saveUsers(users);
    return user;
};
var getUser = (googleId) => {
    var users = fetchUsers();
    var filteredUsers = users.filter( (user) => user.googleId === googleId);
    return filteredUsers[0];
}

var removeUser = (googleId) => {
    var users = fetchUsers();
    var filteredUsers = users.filter( (user) => user.googleId !== googleId);
    saveUsers(filteredUsers);
};


module.exports = {
    getUser,
    addUser
};