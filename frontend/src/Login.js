import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');

    const handleLogin = () => {
        if (username.trim() !== '') {
            fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            })
                .then((response) => response.json())
                .then((data) => {
                    localStorage.setItem('userId', data.senderId)
                    onLogin(data.senderId);
                })
                .catch((error) => {
                    console.error('Error logging in:', error);
                });
        }
    };

    return (
        <div className='login-container'>

            <div className="login-box">
                <h2 className="login-title">Login</h2>
                <input
                    className="login-input"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button className="login-button" onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
}

export default Login;
