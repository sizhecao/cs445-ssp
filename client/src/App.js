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
      },
      createPlaylist: {
        playlistName: '',
        playlistImg: '',
        artistList: null,
      }
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

  getTop50Playlist(){
    const _this = this;
    const playlistID = '37i9dQZEVXbMDoHDwVN2tF';
    spotifyApi.getPlaylist(playlistID)
    .then(function(data){
      console.log(data.body);
      if(data.body){
        _this.setState({
          createPlaylist: {
            playlistName: data.body.name,
            playlistImg: data.body.images[0].url
          }
        });
      }
      else {
        console.log('Invalid playlist ID entered');
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
    
        <div className='loginPhoto'>
          <img src="superSpotifyPlaylistLogo.png" style={{height: 100}} alt="super spotify playlist own logo"/>
          {/*Login component, details in Login.js*/}
          <Login 
            isLoggedIn = {this.state.loggedIn}
            spotifyAPI = {spotifyApi}
          />
        </div>

        {/*When user is logged in, display now playing div*/}
        { this.state.loggedIn &&
        <div className='GUI_content_format'>
          <div className='nowPlaying'>
          <p>
            Current Song Playing:
          </p>
            <div>
              <img src={this.state.nowPlaying.albumArt} style={{height: 250}} alt=''/>
            </div>
            <button onClick={() => this.getNowPlaying()}>
              Check Now Playing
            </button>
            <div>
              Now Playing: {this.state.nowPlaying.name }
            </div>
          </div>

          <div className='generatePlaylist'>
          <p>
            Get Data From A Playlist
          </p>
            <div>
            <img src={this.state.createPlaylist.playlistImg} style={{height: 250}} alt=''/>
            </div>
            <button onClick={() => this.getTop50Playlist()}>
              Get Data from Top 50 Global
            </button>
            <div>
              Getting Data from: {this.state.createPlaylist.playlistName}
            </div>
          </div>
        </div>
        }
      </div>
    );
  }
}



export default App;