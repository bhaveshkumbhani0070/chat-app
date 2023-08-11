import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import ChatRoom from './ChatRoom';
import Login from './Login';

function App() {
  const [loggedInUserId, setLoggedInUserId] = useState(localStorage.getItem('userId') ? localStorage.getItem('userId') : false);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={loggedInUserId ? <Home senderId={loggedInUserId} /> : <Login onLogin={setLoggedInUserId} />}
          />
          <Route path="/" element={loggedInUserId ? <Home senderId={loggedInUserId} /> : <Login onLogin={setLoggedInUserId} />} />
          <Route path="/room/:roomId" element={loggedInUserId ? <ChatRoom senderId={loggedInUserId} /> : <Login onLogin={setLoggedInUserId} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;