import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import './ChatRoom.css';
function ChatRoom({ senderId }) {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Create or reestablish the socket connection
        const newSocket = io('http://localhost:3001');
        setSocket(newSocket);

        // Fetch chat history for the current room when component mounts
        fetch(`http://localhost:3001/api/chat/history/${roomId}`)
            .then((response) => response.json())
            .then((data) => {
                setMessages(data);
            })
            .catch((error) => {
                console.error('Error fetching chat history:', error);
            });

        // Listen for new messages for the current room
        newSocket.on('chat message', (data) => {
            if (data.roomId === roomId) {
                setMessages((prevMessages) => [...prevMessages, data]);
            }
        });

        // Clean up when component unmounts
        return () => {
            newSocket.disconnect();
        };
    }, [roomId]);

    const sendMessage = () => {
        if (socket) {
            const messageData = {
                roomId: roomId,
                senderid: senderId,
                content: message,
            };

            socket.emit('chat message', messageData);
            setMessage('');
        }
    };
    const handleBack = () => {
        navigate('/');
    };
    return (
        <div>
            <div className="chat-room">
                <div className="back-button">
                    <button onClick={handleBack}>Back</button>
                </div>
                <div className="message-container">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.senderid} ${senderId} ${msg.senderid == senderId ? 'own-message' : 'other-message'}`}
                        >
                            {msg.content}
                        </div>
                    ))}
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default ChatRoom;
