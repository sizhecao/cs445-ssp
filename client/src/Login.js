/* This file will be the Login component. This will have all our login
functionality  */

import React from 'react';
import './App.css';

class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isLoggedIn: props.isLoggedIn,
      userName: '',
    }
  }
  componentDidMount() {
    const _this = this;
    this.props.spotifyAPI.getMe().then(
      function (data) {
        console.log(data.body);
        _this.setState({userName: data.body.display_name})
      }, 
      function (err) {
        console.log("Something went wrong", err);
      }
    );
  }

  render() {
    if (this.state.isLoggedIn) {
      return (
        <div className='loginButton'>
            <p>Hi, {this.state.userName}!</p>
        </div>
      );
    }
    else {
      return (
        <div className='loginButton' >
          <a href='http://localhost:8888/login' > LOGIN WITH SPOTIFY </a>
        </div>
      );
    }
  }
}

export default Login;