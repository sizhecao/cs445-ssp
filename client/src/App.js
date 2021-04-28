/* 
This is the 'root' file (it is called in index.js) of our code. 
This file will call Login.js to load the Login page to make sure the user is logged in
and call GeneratePlaylist.js to create a playlist in the user's Spotify library

Authors: Ben LaFave, CJ Cao, Ka’ulu Ng, Chloe Gan 

*/

import './App.css';
import React, { Component } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';
import Login from './Login'; // our login functionality
import GeneratePlaylist from './GeneratePlaylist'; //our generate playlist component

const spotifyApi = new SpotifyWebApi(); //instantiate access to the wrapper's helper methods


class App extends Component {

  constructor() {
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      userName: '',
      topArtists: null,
    }
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
  }

  // getTopArtists() collects the user's Top 20 Artist and stores them in topArtists using the Spotify Api
  getTopArtists() {
    const _this = this;
    spotifyApi.getMyTopArtists()
      .then(
        function (data) {
          if (data.body.items) {
            const topArtistsList = data.body.items.map(artist => artist.id);
            _this.setState({
              topArtists: topArtistsList
            });
          }
        }, function (err) {
          console.log('Something went wrong!', err);
        });
  }

  render() {
    return (
      <div className="App">

        {/*Login page logo photo*/}
        <div className='loginPhoto'>
          <img src="superSpotifyPlaylistLogo.png" alt="super spotify playlist own logo" />
          {/*Login component, (passes vaiables to gen playlist.js?) details in Login.js*/}
          <Login
            isLoggedIn={this.state.loggedIn}
            spotifyAPI={spotifyApi}
          />
        </div>

        {this.state.loggedIn && this.state.topArtists === null && this.getTopArtists()}

        {/*When user is logged in, this will run Generate Playlist.js. spotifyAPI and topArtists data is sent over to the script*/}
        <div>
          {this.state.loggedIn && <GeneratePlaylist spotifyAPI={spotifyApi} topArtists={this.state.topArtists}/>}
        </div>

      </div>
    );
  }
}

export default App;
