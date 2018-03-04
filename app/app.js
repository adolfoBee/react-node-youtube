import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import queryString from 'query-string'

import Login from "./login";
import General from "./general";

class App extends Component {
 	constructor() 
 	{
      const parsed = queryString.parse(location.search);
      super();
	    this.state = {
	      user: null,
        log : parsed.log
	    };

	   this.login = this.login.bind(this);
	   this.logout = this.logout.bind(this);
	   this.renderModule = this.renderModule.bind(this);
  	}

  	
  	login(user)
  	{
  		if(!user || !user.username || user.username == ""){
  			return;
  		}
  		console.log('Loggin as :' + JSON.stringify(user, undefined, 2));
  		this.setState({
      		user: user
    	});
  	}

  	logout()
  	{
  		this.setState({
      		user : null
    	});
  	}
 
  	renderModule()
  	{
  		if(!this.state.log){
  			return (
          		<Login login={this.login}/>
      		);
  		}else{
  			return (
          		<General/>
      		);	
  		}
  	}

  render() {
  	 
    return (
      <div>
           {this.renderModule()}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));