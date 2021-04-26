import React from 'react';
import './App.css';

class GeneratePlaylist extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selectedGenre: '',
      displayState: 'selectGenre',
      GenPlaylistID: null,
      userTrackID: null,
      userArtists: null,
      newTrackList: null,
      GenreID: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  //set the genre type 
  handleChange(event) {
    this.setState({selectedGenre: event.target.value});  
  }

  //when Generate button is called, check if a genre is selected, then switch to displayNewList state.
  handleSubmit(event) {
    if (this.state.selectedGenre !== '') {
      this.setState({displayState: 'displayNewList'});
    }
    event.preventDefault();
  }

  renderSelectGenre() {
    return (
      <div className='selectGenre'>
        <form onSubmit={this.handleSubmit}>
          <p>Select options from the dropdowns and we'll make you an awesome playlist!</p>
            <select value={this.state.selectedGenre} onChange={this.handleChange}> 
              <option value="" disabled>Select Playlist Type</option>
              <option value="Throwback">Throwback</option>
              <option value="Indie">Indie</option>
              <option value="Rap">Rap</option>  
              <option value="Country">Country</option>
              <option value="Jazz">Jazz</option>
            </select>
          <input type='submit' value='Generate!' />
        </form>
      </div>
      
      
    )
  }

  //Set userPlaylistID to a specific playlist ID
  //according to the option selected in the list
  setGeneratePlaylistID(){
    const _this = this;
    if(_this.state.selectedGenre){
      switch(_this.state.selectedGenre){
        case 'Throwback':
          //_this.setState({
          //  GenreID: '6xvGvOrLQIvqncEw4nJkJk'
          //})
          break;
        case 'Rap':
        case 'Indie':
          //_this.setState({
          //  GenreID: '37i9dQZF1DX9LbdoYID5v7'
          //})
          break;
        case 'Country':
        case 'Jazz':
        default: console.log("Invlaid genre selected");
      }
    }
  }
  
  /* let's use this to set playlist details and upload a photo to the playlist
  add to generate playlist method
  // Change playlist details
spotifyApi.changePlaylistDetails('playlist',
  {
    name: 'This is a new name for my Cool Playlist, and will become private',
    'public' : false
  }).then(function(data) {
     console.log('Playlist is now private!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });

  //TBD
// Upload a custom playlist cover image
spotifyApi.uploadCustomPlaylistCoverImage('5ieJqeLJjjI8iJWaxeBLuK','longbase64uri')
  .then(function(data) {
     console.log('Playlsit cover image uploaded!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });

  */
  
  //Generates new playlist and sets the generated playlist's ID 
  //to the variable called GenPlaylistID
  generateNewPlaylist(){
    const _this = this;
    //this.setGeneratePlaylistID()
    _this.props.spotifyAPI.createPlaylist("CS445 Playlist",{ 'description': 'This is the Generated Playlist', 'public': true })
    .then(function(data) {
      console.log('Created playlist!');
      //setting the generate playlist ID to the 
      //variable in this state
      _this.setState({
        GenPlaylistID: data.body.id
      })
    }, function(err) {  
      console.log('Something went wrong!', err);
    });
  }
  //Method to get the artist from a given song ID
  getSongArtists(songID) {
    this.props.spotifyAPI.getTrack(songID)
      .then(
        function (data) {
          console.log('Artist information', data.body.artists);
        },
        function(err) {
          console.error(err);
        }
      );
  }

    //Method to get the list of songs from playlist and 
    //putting that array into the variable newTrackList
    setNewTrackList(playlistID) {
      const _this = this;
      _this.props.spotifyAPI.getPlaylistTracks(playlistID).then(
        function (data) {
          console.log('The playlist contains these tracks: ', data.body.items)
          _this.setState({
            newTrackList: data.body.items
          })
        },
        function(err) {
          console.error(err);
        }
        );
    }

  //Adds tracks to the generated playlist
  //using the newTrackList variable
  addTracksToGenPlaylist(){
    //this.props.spotifyAPI.addTracksToPlaylist(this.state.userPlaylistID, array of track uris)

/* ben's algorithm!
playlistSongs = playlistSongs (from app.js - _this.state.playlistSongs);
topArtist = topArtist (from app.js-  _this.state.topArtist);
for (i 0 ; i < playlistSongs.length ; i++ )
for (j = 0; i < topArtist.length; j++) {
  getSongArtists()

  //if( topArtist[j].id === playlistSongs[i].track.id) ben

//this.props.spotifyAPI.addTracksToPlaylist(this.state.userPlaylistID, array of track uris)
}
*/
    const _this = this;
    _this.props.spotifyAPI.addTracksToPlaylist("29rk5AOVz8uUgx02BH3Ast", "spotify:track:6pDVjCUA3B1vg9waKutAsv")
    .then(function(data) {
      console.log(data);
      console.log('Successfully added songs to the playlist')
    }, function(err) {  
      console.log('Something went wrong!', err);
    });
  }

  renderDisplayNewList() {
    if(this.state.GenPlaylistID == null){
      this.generateNewPlaylist();
    }
    else if(this.state.newTrackList == null){
      this.setNewTrackList('3Re1NJE0PzaLauOHXnxsxf');
    }
    else if(this.state.newTrackList){
      this.addTracksToGenPlaylist();
    }
    console.log('GenPlaylistID', this.state.GenPlaylistID);
    console.log('newTrackList', this.state.newTrackList);
    return (
      <div className='displayNewList'>
        <div>
          <p>A New {this.state.selectedGenre} playlist.</p>
        </div>
        <div>
          <p>  right panel, back to generate playlist button</p>
        </div>
      </div>
    )
  }

  render() {
    switch (this.state.displayState) {
      case 'selectGenre':
        return this.renderSelectGenre();
      case 'displayNewList':
        return this.renderDisplayNewList();
      default:
        return null;
    }
  }
}

export default GeneratePlaylist;

  // componentDidMount() {
  //   // example of api calls, see web console for data structure
  //   const _this = this;
  //   this.props.spotifyAPI.getMe()
  //   .then(function(data) {
  //     console.log(data.body);
  //     _this.setState({userName: data.body.display_name})
  //     return _this.props.spotifyAPI.getUserPlaylists(data.body.display_name);
  //   })
  //   .then(function(data) {
  //     console.log(data.body);
  //     _this.setState({playlists: data.body.items})
  //     return _this.props.spotifyAPI.getPlaylist('0hOgSihQE8qFl0RSBOYRId');
  //   })
  //   .then(function(data) {
  //     console.log("playlist: ", data.body);
  //   })
  //   .catch(function(err) {
  //     console.log('Something went wrong:', err.message);
  //   });
  // }


  //renders a list of user playlists
  // renderPlaylists(playlists) {
  //   const playlistsList = playlists.map((item) => (
  //     <div className="playlist">
  //       <img src={item.images[0].url} alt='' />
  //       <ul>
  //         <li>Name: {item.name} </li>
  //         <li>Id: {item.id}</li>
  //       </ul>
  //     </div>
  //   ));
  //   return playlistsList;
  // }