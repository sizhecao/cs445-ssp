import React from 'react';
import './App.css';

class GeneratePlaylist extends React.Component {

  //store generated tracks, each track contains title and artist name
  GenTracks = [];

  constructor(props){
    super(props);
    this.state = {
      selectedGenre: '',
      displayState: 'selectGenre',
      GenPlaylistID: null,
      GenPlaylistImg: '',
      tracksAdded: false,
      newTrackList: null,
      GenreID: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.backToGenerate = this.backToGenerate.bind(this);
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
  
  //Generates new playlist and sets the generated playlist's ID 
  //to the variable called GenPlaylistID
  generateNewPlaylist(){
    var currentdate = new Date(); 
    var datetime = (currentdate.getMonth()+1) + "/"
                + currentdate.getDate()  + "/" 
                + currentdate.getFullYear() + "-" 
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

    const playlistName = "CS445 Playlist " + datetime;
    const _this = this;
    _this.props.spotifyAPI.createPlaylist(playlistName,{ 'description': 'This is the Generated Playlist', 'public': true })
    .then(function(data) {
      console.log('Created playlist!');
      //console.log(data);
      //setting the generate playlist ID to the 
      //variable in this state
      _this.setState({
        GenPlaylistID: data.body.id,
      })
    }, function(err) {  
      console.log('Something went wrong in creating a new playlist', err);
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
  addTracksToGenPlaylist(){
    const myList = [];
    //Iterate through this.props.TopArtists, for each artist, then iterate through the newTracklist. If find a matching artist, then save the track id. 
    this.props.topArtists.forEach(artist => {
      this.state.newTrackList.forEach(track => {
        if (track.track.artists[0].id) {
          if (track.track.artists[0].id === artist) {
            this.GenTracks.push({trackName: track.track.name, trackArtist: track.track.artists[0].name});
            myList.push(track.track.id);
            //console.log("artists: ", track.track.name);
          }
        }
      })
    })

    //remapping for the api call
    const tracksToAdd = myList.map(track => "spotify:track:" + track);

    //console.log("tracksToAdd: ", tracksToAdd);
    const _this = this;
    if(tracksToAdd.length > 0) {
      _this.props.spotifyAPI.addTracksToPlaylist(_this.state.GenPlaylistID, tracksToAdd)
      .then(function() {
        console.log('Successfully added songs to the playlist')
        _this.setState({tracksAdded: true});
        return _this.props.spotifyAPI.getPlaylist(_this.state.GenPlaylistID);
      })
      .then(function(data) {
        //can collect generated playlist info here
        //console.log(data);
        _this.setState({
          GenPlaylistImg: data.body.images[0].url,
        })
      })
      .catch(function(err) {
        console.log('Something went wrong:', err.message);
      });
    }
    else {
      //remove the empty playlist created
      _this.props.spotifyAPI.unfollowPlaylist(_this.state.GenPlaylistID)
      .then(function() {
        console.log('Empty playlist successfully unfollowed since no song has added!');
      }, function(err) {
        console.log('Something went wrong!', err);
      }); 
    }
  }

  renderDisplayNewList() {
    if(this.state.GenPlaylistID == null){
      this.generateNewPlaylist();
    }
    else if(this.state.newTrackList == null){
      //this.setNewTrackList('3Re1NJE0PzaLauOHXnxsxf');
      //this.setNewTrackList('6xvGvOrLQIvqncEw4nJkJk'); throwback
      //this.setNewTrackList('0UPRbBJvOpNP9oN9lcEm0q'); cj test playlist
      switch (this.state.selectedGenre) {
        case "Throwback":
          this.setNewTrackList('6xvGvOrLQIvqncEw4nJkJk'); //throwback playlist id
          break;
        case "Indie":
          this.setNewTrackList('3Re1NJE0PzaLauOHXnxsxf'); //Indie playlist id
          break;
        case "Rap":
          this.setNewTrackList('0UPRbBJvOpNP9oN9lcEm0q'); //Rap playlist id
          break;
        case "Country":
          this.setNewTrackList('6xvGvOrLQIvqncEw4nJkJk'); //Country playlist id
          break;
        case "Jazz":
          this.setNewTrackList('6xvGvOrLQIvqncEw4nJkJk'); //Jazz playlist id
          break;
        default:
          this.setNewTrackList('6xvGvOrLQIvqncEw4nJkJk'); // default to throwback playlist
      }
    }
    else if(this.state.newTrackList && !this.state.tracksAdded){
      this.addTracksToGenPlaylist();
    }
    //console.log(this.GenTracks);
    const newPlaylistTracks = this.GenTracks.map((track) => (
          <li key={track.trackName}>{track.trackName}         By {track.trackArtist}</li>
    ));

    if (this.state.tracksAdded) {
      return (
        <div>
          <div className='displayNewList'>
            <div className='displayNewList-left-panel'>
              <p>A peek to your generated new list: </p>
            </div>
            <div className='displayNewList-middle-panel'>
              <img src={this.state.GenPlaylistImg} style={{height: 250}} alt=''/>
            </div>
            <div className='displayNewList-right-panel'>
              <ul>
                {newPlaylistTracks}
              </ul>
            </div>
          </div>
          <div className='generate-new-playlist'>
            <input type='button' value='Generate another playlist!' onClick={this.backToGenerate} />
          </div>
        </div>
      );
    }
    else {
      return (
        <div>
          <div className='displayNewList'>
            <p>No playlist generated, listen to more songs or try a different genre</p>
          </div>
          <div className='generate-new-playlist'>
            <input type='button' value='Generate a new playlist!' onClick={this.backToGenerate} />
          </div>
        </div>
      );
    }
  }

  backToGenerate() {
    //resetting to default
    this.setState({
      GenPlaylistID: null,
      newTrackList: null,
      tracksAdded: false,
      displayState: 'selectGenre'
    })
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

  //Display Generate button or a new playlist
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