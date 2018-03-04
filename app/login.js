import React from "react";

class Login extends React.Component
{
    constructor(props){
        super(props);

        this.state = {
            username: ''
        };

        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick(ev)
    {
        ev.preventDefault();
        var user = {
            username: this.state.username
        };
        
        this.props.login(user);
        this.setState({
            username: ''
        });
    }

    render(){
        return (
            <div className="login-container">
                <p>Login with: <a href="/auth/google"><i class="fab fa-google"></i><span>oogle</span></a></p>
            </div>
        );
    }
}

export default Login;