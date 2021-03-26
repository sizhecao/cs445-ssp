/* This file will be the Login component. This will have all our login
functionality  */

import React from 'react';
import './App.css';

function Login() {
    return (
        <div className='loginPhoto'>

            {/* Spotify Logo. Wont load :( */}
            <img src="superSpotifyPlaylistLogo.png" alt="super spotify playlist own logo"/>

            <div className='loginButton' >
                {/* Login with Spotify button */}
                <a href='http://localhost:8888' > LOGIN WITH SPOTIFY </a>

            </div>

        </div>
        
        
    )
}

export default Login;