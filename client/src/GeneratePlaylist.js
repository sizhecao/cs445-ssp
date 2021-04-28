
/* 
This file is called in the app.js render() and brings in the Spotify API and the users Top 20 Artists.
GeneratePlaylist.js creates a playlist in the user's Spotify library and adds Songs from their top artists.

Authors: Ben LaFave, CJ Cao, Ka’ulu Ng, Chloe Gan 

*/

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

    const playlistName = "Super Spotify Playlist " + datetime;
    const _this = this;
    //Using the Spotify API to generate a playlist
    //so that songs can be added to it 
    _this.props.spotifyAPI.createPlaylist(playlistName,{ 'description': 'This is the Generated Playlist', 'public': true })
    .then(function(data) {
      console.log('Created playlist!');
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
  async setNewTrackList(playlistID) {
    const playlist = await this.getPlaylistWithTracks(playlistID);
    console.log("----", playlist.tracks.items);
    //Setting the tracks taken from the playlist to the 
    //variable in the state newTrackList
    this.setState({
      newTrackList: playlist.tracks.items
    })
  }

  async getPlaylistWithTracks(id) {
    const _this = this;
    const playlist = (await _this.props.spotifyAPI.getPlaylist(id)).body
    
    // if there is more tracks than the limit (100 by default)
    if (playlist.tracks.total > playlist.tracks.limit) {

      // Divide the total number of track by the limit to get the number of API calls
      for (let i = 1; i < Math.ceil(playlist.tracks.total / playlist.tracks.limit); i++) {

        const trackToAdd = (await _this.props.spotifyAPI.getPlaylistTracks(id, {
          offset: playlist.tracks.limit * i // Offset each call by the limit * the call's index
        })).body;

        // Push the retreived tracks into the array
        trackToAdd.items.forEach((item) => playlist.tracks.items.push(item));
      }
    }
    return playlist;
  }

  //Adds tracks to the generated playlist
  //This method includes the main algorithm to choosing songs that the user 
  //will enjoy and adding them to a list of songs to be added to their playlist.
  addTracksToGenPlaylist(){
    const myList = [];
    //Iterate through this.props.TopArtists, for each artist, then iterate through the newTracklist. 
    //If find a matching artist, then save the track id. 
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
        //Collect generated playlist info here
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

  //Running respective methods depending on what state the program 
  //is in and also displaying the correct information to the screen
  renderDisplayNewList() {
    //Only running generate playlist ID method one time 
    //If no playlist has been made during this session
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
          this.setNewTrackList('37i9dQZF1DX0XUsuxWHRQd'); //Rap playlist id
          break;
        case "Country":
          this.setNewTrackList('37i9dQZF1DX13ZzXoot6Jc'); //Country playlist id
          break;
        case "Jazz":
          this.setNewTrackList('03v08073YFtriJYto8uO1K'); //Jazz playlist id
          break;
        default:
          this.setNewTrackList('6xvGvOrLQIvqncEw4nJkJk'); // default to throwback playlist
      }
    }
    else if(this.state.newTrackList && !this.state.tracksAdded){
      this.addTracksToGenPlaylist();
    }
    //console.log(this.GenTracks);
    const newPlaylistTracks = this.GenTracks.slice(0,10).map((track) => (
          <li key={track.trackName}>{track.trackName}         By {track.trackArtist}</li>
    ));
    
    if (this.state.tracksAdded) {
      return (
        <div>
          <div className='displayNewList'>
            <div className='displayNewList-left-panel'>
              <p>A peek to your generated new list: </p>
              <div className='displayNewList-middle-panel'>
              <img src={this.state.GenPlaylistImg} style={{height: 250}} alt=''/>
              <div className='generate-new-playlist'>
            <input type='button' value='Generate another playlist!' onClick={this.backToGenerate} />
          </div>
            </div>
            </div>  
            <div className='displayNewList-right-panel'>
              <ul>
                {newPlaylistTracks}
                <li key={"more songs"}>......</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }
    else {
      if(this.state.newTrackList !== null) {
        return (
          <div>
            <div className='displayNewList'>
              <p>No playlist generated, listen to more songs or try a different genre</p>
            </div>
            <div className='displayNewList'>
              <input type='button' value='Generate a new playlist!' onClick={this.backToGenerate} />
            </div>
          </div>
        );
      }
      else {
        return(
          <div className='displayNewList'>
            <p>loading...</p>
          </div>
        )
      }
    }
  }

  backToGenerate() {
    //resetting to default
    this.GenTracks = [];
    this.setState({
      GenPlaylistID: null,
      newTrackList: null,
      tracksAdded: false,
      displayState: 'selectGenre',
      GenPlaylistImg: ''
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
  //Renders a drop down menu for selecting genres 
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
