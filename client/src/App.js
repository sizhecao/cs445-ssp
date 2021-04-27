import './App.css';
import React, { Component } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';
import Login from './Login'; // our login functionality
import GeneratePlaylist from './GeneratePlaylist'; //our generate playlist component

const spotifyApi = new SpotifyWebApi();


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
      nowPlaying: {
        name: 'Not Checked',
        ablumArt: ''
      },
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

        <div className='loginPhoto'>
          <img src="superSpotifyPlaylistLogo.png" alt="super spotify playlist own logo" />
          {/*Login component, (passes vaiables to gen playlist.js?) details in Login.js*/}
          <Login
            isLoggedIn={this.state.loggedIn}
            spotifyAPI={spotifyApi}
          />
        </div>

        {this.state.loggedIn && this.state.topArtists === null && this.getTopArtists()}

        {/*When user is logged in, display now playing div and/or Genrate Playlist (Where the now playing used to be)*/}
        <div>
          {this.state.loggedIn && 
            <GeneratePlaylist 
              spotifyAPI={spotifyApi} 
              topArtists={this.state.topArtists}
            />}
        </div>

      </div>
    );
  }
}

export default App;

// getNowPlaying() {
//   const _this = this;
//   spotifyApi.getMyCurrentPlaybackState()
//     .then(
//       function (data) {
//         if (data.body && data.body.is_playing) {
//           console.log("User is currently playing something!");
//           _this.setState({
//             nowPlaying: {
//               name: data.body.item.name,
//               albumArt: data.body.item.album.images[0].url,
//               artist: data.body.item.artists
//             }
//           });
//           console.log(data.body);
//         } else {
//           console.log("User is not playing anything, or doing so in private.");
//         }
//       },
//       function (err) {
//         console.log("Something went wrong", err);
//       }
//     );
// }

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