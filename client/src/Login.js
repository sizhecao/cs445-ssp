/* This file will be the Login component. This will have all our login
functionality  */

import React from 'react';
import './App.css';

function Login() {
    return (
        <div className='login'>

            {/* Spotify Logo. Wont load :( */}
            <img src="src/super_spotify_playlist_logo.png" alt=""/>

            {/* Login with Spotify button */}
            <a href='http://localhost:8888' > LOGIN WITH SPOTIFY </a>



            
        </div>
    )
}

export default Login;