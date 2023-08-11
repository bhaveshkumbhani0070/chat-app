# Chat Application Project

This project is a chat application with both backend and frontend components. The backend manages server-side logic, while the frontend provides the user interface for interacting with the chat application.

## Getting Started

To run the project locally, follow these steps:

1. Install dependencies for the root directory:

```sh
    npm install
```

2. Navigate to the "backend" folder and install backend dependencies:

```sh
    cd backend
    npm install
```

3. Navigate to the "frontend" folder and install frontend dependencies:

```sh
    cd frontend
    npm install
```

4. Return to the root directory:

```sh
    cd ..
```

5. Start both the backend and frontend:

```sh
    npm run start:both
```

## Usage

1. Open your web browser and go to `localhost:3000`.
2. On the initial page, you'll encounter a login screen. Enter your username. If the username doesn't exist, a new user will be created, and the user ID will be stored in local storage.
3. After a successful login, you'll see the list of available Chat Rooms. You can create a new chat room by providing a room name.
4. Select a chat room to enter the chat interface. In this interface, you can engage in real-time conversations with groups or individual users. The chat history will also be displayed.

## Requirements

1. Node.js and npm must be installed on your system.

## Database

1. Messages

```sh
   CREATE TABLE IF NOT EXISTS public.messages
   (
        id integer NOT NULL DEFAULT nextval('messages_id_seq'::regclass),
        roomid character varying COLLATE pg_catalog."default" NOT NULL,
        senderid integer NOT NULL,
        content text COLLATE pg_catalog."default" NOT NULL,
        "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT messages_pkey PRIMARY KEY (id)
   )

    TABLESPACE pg_default;

    ALTER TABLE IF EXISTS public.messages
    OWNER to "default";
```

2. Rooms

```sh
   CREATE TABLE IF NOT EXISTS public.rooms
   (
    roomid character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT rooms_pkey PRIMARY KEY (roomid)
   )

    TABLESPACE pg_default;

    ALTER TABLE IF EXISTS public.rooms
    OWNER to "default";
```

3. Users

```sh
    CREATE TABLE IF NOT EXISTS public.users
    (
        id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
        username character varying COLLATE pg_catalog."default",
        CONSTRAINT users_pkey PRIMARY KEY (id),
        CONSTRAINT users_username_key UNIQUE (username)
    )

    TABLESPACE pg_default;

    ALTER TABLE IF EXISTS public.users
    OWNER to "default";
```
