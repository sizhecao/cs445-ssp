# 2021 CS445 Super Spotify Playlist

## Required Software
 - [Git](https://git-scm.com/downloads)
 - [Node](https://nodejs.org/en/download/)

## Project Setup 
1. Clone the project to your local computer<br/>
`git clone https://github.com/sizhecao/cs445-ssp.git`
<br/>

2. Install node modules for server<br/>
`cd cs445-ssp/server`<br/>
`npm install`<br/>
If install successfully, then do <br/>`node authorization_code/app.js`<br/> to start the server. The server will be running on `localhost:8888`. 
<br/>

3. Install node modules for client<br/>
`cd cs445-ssp/client`<br/>
`npm install`<br/>
If install successfully, then do <br/>`npm start`<br/> to start the react app. The web application will be running automatically on `localhost:3000`. 
<br/>

4. Development Notes<br/>
   - Start `server` first and then start the `client`. 
   - Try not to push `package-lock.json` changes if no new libraries are added. 



## API Usage 
1. To use the API<br/>
Import API wrapper library on top of the file<br/>
```javascript
import SpotifyWebApi from 'spotify-web-api-node';
```
Then instantiate the library by: <br/>
```javascript
const spotifyApi = new SpotifyWebApi();
```
2. Make API call<br/>
This API wrapper uses promises, so you will need to provide a success callback as well as an error callback.<br/>
```javascript
// Example API call
spotifyApi.apiCall().then(
    function(data) {
        //Success callback
    }, 
    function(err) {
        //Error callback
    }
);
```
## CS 445 - Notes for Tammy <br/>
Here are a list of the main files used in our development. Please see comments in these files. Thanks! 
client/src/App.js
client/src/Login.js
client/src/GeneratePlaylist.js

## Dev Resources
 - [Spotify React Tutorial](https://medium.com/@jonnykalambay/now-playing-using-spotifys-awesome-api-with-react-7db8173a7b13)
 - [spotify-web-api-node](https://github.com/thelinmichael/spotify-web-api-node)
