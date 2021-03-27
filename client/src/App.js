import './App.css';
import React, { Component }from 'react';
import SpotifyWebApi from 'spotify-web-api-node';
import Login from './Login'; // our login functionality

const spotifyApi = new SpotifyWebApi();


class App extends Component {

  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: {
        name: 'Not Checked',
        ablumArt: ''
      } //need to add variable to hold playlists (array)
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

  getNowPlaying() {
    const _this = this;
    spotifyApi.getMyCurrentPlaybackState()
      .then(
        function(data) {
          if (data.body && data.body.is_playing) {
            console.log("User is currently playing something!");           
            _this.setState({
              nowPlaying: { 
                  name: data.body.item.name, 
                  albumArt: data.body.item.album.images[0].url
                }
            });
            console.log(data.body);
          } else {
            console.log("User is not playing anything, or doing so in private.");
          }
        }, 
        function(err) {
          console.log("Something went wrong", err);
        }
      );
  }

  render() {
    return (
      <div className="App">

        <Login />  {/* This component is written in Login.js */}

        <div>
          Now Playing: { this.state.nowPlaying.name }
        </div>

        {/* Display album art */}
        <div>
          <img src={this.state.nowPlaying.albumArt} style={{height: 250}} alt=''/>
        </div>

        {/*Button to check if logged in, and then to get the song that is playing*/}
        { this.state.loggedIn &&
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
        } 
        <div>
          Now Playing: {this.state.nowPlaying.name }
        </div>
      </div>
      
    );
  }
}



export default App;