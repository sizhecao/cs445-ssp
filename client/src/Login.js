/* 

This file will be the Login component. This will have all our login functionality. 
This file determines html elements to be rendered when it is called in app.js. 

Authors: Ben LaFave, CJ Cao, Ka’ulu Ng, Chloe Gan 

*/

import React from 'react';
import './App.css'; // so we can change the html formats


class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isLoggedIn: props.isLoggedIn,
      userName: '',
      playlists: null,
    }
  }

  componentDidMount() {
    const _this = this;
    this.props.spotifyAPI.getMe()
    .then(function(data) {
      //console.log(data.body);
      _this.setState({userName: data.body.display_name})
      //console.log(data.body.display_name);
      return _this.props.spotifyAPI.getUserPlaylists(data.body.display_name);
    })
    .then(function(data) {
      //console.log(data.body);
      _this.setState({playlists: data.body.items})
    })
    .catch(function(err) {
      console.log('Something went wrong:', err.message);
    });
  }
  
  renderPlaylists(playlists) {
    const playlistsList = playlists.map((item) => (
      <div className="playlist">
        <img src={item.images[0].url} alt='' />
        <ul>
          <li>Name: {item.name} </li>
          <li>Id: {item.id}</li>
        </ul>
      </div>
    ));
    return playlistsList;
  }

  render() {
    //display user playlists if logged in, otherwise display login button
    if (this.state.isLoggedIn) {
      return (
        <div className='loginButton'>
          {/**displays your spotify */}
            <p>Hi, {this.state.userName}!</p>
            <div>
            </div>
        </div>
      );
    }
    else {
      return (

        //This is the actual login button
        <div className='loginButton' >
          {/*/ you get sent to the next page with the href*/}
          <a href='http://localhost:8888/login' > LOGIN WITH SPOTIFY </a>
        </div>
      );
    }
  }
}

export default Login;
