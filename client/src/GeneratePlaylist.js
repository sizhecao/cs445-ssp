import React from 'react';
import './App.css';

class GeneratePlaylist extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selectedGenre: '',
      displayState: 'selectGenre',
      userPlaylistID: null,
      userTrackID: null,
      userArtists: null,
      newTrackList: null,

    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    //example of api calls, see web console for data structure
    const _this = this;
    this.props.spotifyAPI.getMe()
    .then(function(data) {
      console.log(data.body);
      _this.setState({userName: data.body.display_name})
      return _this.props.spotifyAPI.getUserPlaylists(data.body.display_name);
    })
    .then(function(data) {
      console.log(data.body);
      _this.setState({playlists: data.body.items})
      return _this.props.spotifyAPI.getPlaylist('0hOgSihQE8qFl0RSBOYRId');
    })
    .then(function(data) {
      console.log("playlist: ", data.body);
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

  handleChange(event) {
    this.setState({selectedGenre: event.target.value});  
  }
  handleSubmit(event) {
    
    console.log("submit selected genre: ", this.state.selectedGenre);
    console.log("display state: ", this.state.displayState);
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
              <option value="Rap">Rap</option>
              <option value="Country">Country</option>
              <option value="Jazz">Jazz</option>
            </select>
          <input type='submit' value='Generate!' />
        </form>
      </div>
    )
  }

  renderDisplayNewList() {
    //call api to get all users playlists id (getUserPlaylists), save them in userPlaylistID
    //call api to get all track ids from each playlist (getPlaylist), save them in userTrackID
    //call api to get all artists from each track in each playlist using above api call, save them in userArtists
    //randomly pick up to ten artists from userArtists and use spotifyApi.searchTracks('artist:name'),  
    //pick a track from searched tracks, check track id is already in userTrackID, if in, pick another the next song and does checking, if not add this track into newTrackList
    //create a newTrackList with 10 new songs
    //create a new playlist (spotifyApi.createPlaylist('My playlist', { 'description': 'My description', 'public': true }))
    //add those 10 new songs from newTrackList in to the new playlist(spotifyApi.addTracksToPlaylist(...))
    
    return (
      <div className='displayNewList'>
        <div>
          <p>new song list for {this.state.selectedGenre}     .</p>
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
