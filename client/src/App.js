import './App.css';
import React, { Component }from 'react';
import SpotifyWebApi from 'spotify-web-api-node';
import Login from './Login'; // our login functionality
import GeneratePlaylist from './GeneratePlaylist'; //our generate playlist component

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
      userName: '',
      nowPlaying: {
        name: 'Not Checked',
        ablumArt: ''
      },
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

  //Method to get the list of songs from playlist
  getPlaylistSongs(playlistID) {
    spotifyApi.getPlaylistTracks(playlistID)
      .then(function (data) {

      });
  }

  //Method to get the artist from a song 
  getArtists(song) {
//chloe
  }




  render() {
    return (
      <div className="App">

        <div className='loginPhoto'>
          <img src="superSpotifyPlaylistLogo.png" alt="super spotify playlist own logo" />
          {/*Login component, details in Login.js*/}
          <Login
            isLoggedIn={this.state.loggedIn}
            spotifyAPI={spotifyApi}
          />
        </div>
<<<<<<< HEAD

        {/*When user is logged in, display now playing div and/or Genrate Playlist (Where the now playing used to be)*/}
=======
        {/*When user is logged in, display now playing div*/}
>>>>>>> 6e212bb7f4da84468ddc6b9294eec30d3c9b4958
        <div>
          {this.state.loggedIn && <GeneratePlaylist spotifyAPI={spotifyApi} />}
        </div>
        
      </div>
    );
  }
}

export default App;

/*
        <div className='GUI_content_format'>
          <div className='nowPlaying'>
            <p>Current Song Playing:</p>
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
            <p>Get Data From A Playlist</p>
            <div>
            <img src={this.state.createPlaylist.playlistImg} style={{height: 250}} alt=''/>
            </div>
            <button onClick={() => this.getPlaylistData()}>
              Get Data from Top 50 Global
            </button>
            <div>
              Getting Data from: {this.state.createPlaylist.playlistName}
            </div>
          </div>
        </div>



        
*/