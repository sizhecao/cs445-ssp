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
      GenPlaylistID: '',
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
          _this.setState({
            userPlaylistID: '6xvGvOrLQIvqncEw4nJkJk'
          })
          break;
        case 'Rap':
        case 'Indie':
          _this.setState({
            userPlaylistID: '37i9dQZF1DX9LbdoYID5v7'
          })
        case 'Country':
        case 'Jazz':
        default: console.log("Invlaid genre selected");
      }
    }
  }

  //Get the data from a playlist, 
  getPlaylistData(playlistID){
    const _this = this;
    _this.props.spotifyApi.getPlaylist(playlistID)
    .then(
      function(data) {
        if (data.body) {
          return data.body;
        }
        else{
          console.log("Invalid Playlist ID");
        }
      },
      function(err){
        console.log("Something went wrong", err);
      }
      );
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
  
  generateNewPlaylist(){
    //this.setGeneratePlaylistID()
    this.props.spotifyAPI.createPlaylist("CS445 Playlist",{ 'description': 'This is the Generated Playlist', 'public': true })
    .then(function(data) {
      console.log('Created playlist!');
      console.log(data.body);
    }, function(err) {  
      console.log('Something went wrong!', err);
    });
    this.props.spotifyAPI.getUserPlaylists(this.props.userName)
    .then(function(data) {
      console.log('success!');
      console.log(data.body);
      this.setState({
        GenPlaylistID: data.body.item[0].id
      })

    }, function(err) {  
      console.log('Something went wrong!', err);
    });
    
  }

  renderDisplayNewList() {
    this.generateNewPlaylist();
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