import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Home.css';

function Home({ senderId }) {
    console.log('senderId', senderId);
    const navigate = useNavigate();
    const [roomList, setRoomList] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');

    useEffect(() => {
        // Fetch list of chat rooms
        fetch(`http://localhost:3001/api/chat/rooms`)
            .then((response) => response.json())
            .then((data) => {
                setRoomList(data);
            })
            .catch((error) => {
                console.error('Error fetching chat rooms:', error);
            });
    }, []);

    const createRoom = () => {
        if (newRoomName.trim() !== '') {
            // Send a request to create a new room
            fetch(`http://localhost:3001/api/chat/create-room`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roomName: newRoomName }),
            })
                .then((response) => response.json())
                .then((data) => {
                    // Update the room list
                    setRoomList([...roomList, data.roomId]);
                    setNewRoomName('');
                })
                .catch((error) => {
                    console.error('Error creating chat room:', error);
                });
        }
    };
    const onLogout = () => {
        localStorage.removeItem('userId');
        navigate('/');
        window.location.reload();
    }
    return (
        <div className='home-container'>
            <div className="room-list">
                <h1 className="room-list-title">Chat Rooms</h1>
                <form className="create-room-form">
                    <input
                        className="create-room-input"
                        type="text"
                        placeholder="Enter room name"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                    />
                    <button className="create-room-button" type="button" onClick={createRoom}>
                        Create Room
                    </button>
                </form>
                <ul>
                    {roomList.map((roomId) => (
                        <li key={roomId} className="room-item">
                            <Link to={`/room/${roomId}`} className="room-link">{roomId}</Link>
                        </li>
                    ))}
                </ul>
                <button className="logout-button" onClick={onLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Home;
