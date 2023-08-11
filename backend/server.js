const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const socketIO = require('socket.io');
const pg = require('pg');

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors())
app.use(express.json());
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

const PORT = process.env.PORT || 3001;

const pool = new pg.Pool({
    user: 'default',
    host: 'ep-lingering-darkness-35029060-pooler.us-east-1.postgres.vercel-storage.com',
    database: 'verceldb',
    password: 'ugJ3OkdK1tba',
    port: 5432,
    ssl: {
        rejectUnauthorized: false,
    },
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('chat message', (data) => {
        const { roomId, senderid, content } = data;
        // Insert the message into the database
        const insertQuery = 'INSERT INTO messages (roomId, senderId, content) VALUES ($1, $2, $3)';
        const values = [roomId, senderid, content];
        io.emit('chat message', data);

        // Execute the query using your PostgreSQL driver
        pool.query(insertQuery, values)
            .then(() => {
                // io.to(roomId).emit('chat message', data); // Broadcast the message
                console.log('added');
            })
            .catch((error) => {
                console.error('Error inserting message:', error);
            });
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.get('/api/chat/rooms', (req, res) => {
    // Fetch all chat rooms from the database
    const selectQuery = 'SELECT DISTINCT roomId FROM rooms';

    pool.query(selectQuery)
        .then((result) => {
            const rooms = result.rows.map(row => row.roomid);
            res.json(rooms);
        })
        .catch((error) => {
            console.error('Error fetching chat rooms:', error);
            res.status(500).json({ error: 'An error occurred while fetching chat rooms.' });
        });
});

app.post('/api/chat/create-room', (req, res) => {
    const { roomName } = req.body;
    // Store the new room in the database
    const insertQuery = 'INSERT INTO rooms (roomId) VALUES ($1)';
    const values = [roomName];

    pool.query(insertQuery, values)
        .then(() => {
            res.json({ roomId: roomName });
        })
        .catch((error) => {
            console.error('Error creating chat room:', error);
            res.status(500).json({ error: 'An error occurred while creating the chat room.' });
        });
});
app.get('/api/chat/history/:roomId', (req, res) => {
    const roomId = req.params.roomId;

    // Fetch chat history for the specified room from the database
    const selectQuery = 'SELECT senderId, content FROM messages WHERE roomId = $1 ORDER BY timestamp ASC';
    const values = [roomId];

    pool.query(selectQuery, values)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((error) => {
            console.error('Error fetching chat history:', error);
            res.status(500).json({ error: 'An error occurred while fetching chat history.' });
        });
});

app.post('/api/auth/login', (req, res) => {
    const { username } = req.body;

    // Check if the user already exists in the database
    const selectQuery = 'SELECT id FROM users WHERE username = $1';
    const values = [username];

    pool.query(selectQuery, values)
        .then((result) => {
            if (result.rows.length > 0) {
                // User already exists, return the existing senderId
                res.json({ senderId: result.rows[0].id });
            } else {
                // Insert the new user into the database and return the new senderId
                const insertQuery = 'INSERT INTO users (username) VALUES ($1) RETURNING id';
                pool.query(insertQuery, values)
                    .then((insertResult) => {
                        res.json({ senderId: insertResult.rows[0].id });
                    })
                    .catch((error) => {
                        console.error('Error inserting user:', error);
                        res.status(500).json({ error: 'An error occurred while inserting user.' });
                    });
            }
        })
        .catch((error) => {
            console.error('Error checking user:', error);
            res.status(500).json({ error: 'An error occurred while checking user.' });
        });
});


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
