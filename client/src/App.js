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
      playlistSongs: null,

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
        function (data) {
          if (data.body && data.body.is_playing) {
            console.log("User is currently playing something!");
            _this.setState({
              nowPlaying: {
                name: data.body.item.name,
                albumArt: data.body.item.album.images[0].url,
                artist: data.body.item.artists
              }
            });
            console.log(data.body);
          } else {
            console.log("User is not playing anything, or doing so in private.");
          }
        },
        function (err) {
          console.log("Something went wrong", err);
        }
      );
  }

  getTopArtists() {
    const _this = this;
    spotifyApi.getMyTopArtists()
      .then(
        function (data) {
          if (data.body.items) {
            _this.setState({
              topArtists: data.body.items, //data.body.items[0].id
            });
            console.log('Top artist[0] id: ', _this.state.topArtists[0].id); //_this.state.topArtists[0].id for compare
          } else {
            console.log('data.body null, something went wrong!');
          }
        }, function (err) {
          console.log('Something went wrong!', err);
        });
  }

  //Method to get the list of songs from playlist
  getPlaylistSongs(playlistID) {
    const _this = this;
    spotifyApi.getPlaylistTracks(playlistID)
    .then(
      function (data) {
        if (data.body) {
          _this.setState({
            playlistSongs: data.body.items, //data.body.items[0].id
          });
          console.log('The playlist contains these tracks: ', _this.state.playlistSongs); // _this.state.playlistSongs[0].track.id for compare
        } else {
          console.log('data.body null, something went wrong!');
        }
      }, function (err) {
        console.error(err);
      }
    );
  }

  //Method to get the artist from a song 
  getSongArtists(songID) {
    spotifyApi.getTrack(songID).then(
      function (data) {
        console.log('Artist information', data.body.artists);
      },
      function (err) {
        console.error(err);
      }
    );
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


        <div>
          {/*this.state.loggedIn && this.getTopArtists()*/ /*trying to figure out how to call a method once for testing...help! -Ben */}
          {(this.state.topArtists == null) && this.getTopArtists()}
          {(this.state.playlistSongs == null) && this.getPlaylistSongs('6xvGvOrLQIvqncEw4nJkJk')} {/*for testing*/}
        </div>

        {/*When user is logged in, display now playing div and/or Genrate Playlist (Where the now playing used to be)*/}
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