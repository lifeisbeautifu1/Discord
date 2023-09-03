[![Made With Love](https://img.shields.io/badge/Made%20With-Love-red.svg)](https://github.com/lifeisbeautifu1)
# Discord

> Note, this project is under construction 🚧 🏗️ ⛔

[Photos of the project](https://imgur.com/a/MAvmtkm)

# Installation & Setup

## Setting up the Backend

1. Clone the repository.
2. Change directory to backend
3. Run `npm install` to install dependencies.
4. Install Docker for your operating system.
5. Install the [Docker Compose](https://docs.docker.com/compose/install/) tool.
6. Run docker-compose

```
docker-compose up -d
```

This will start container with PostgreSQL, Redis and Redis Commander.

7. Run the following command

```
npx prisma db push
```

8. Create a `.env` file in the root directory and paste the following:

```
DATABASE_URL=

SESSION_SECRET=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

MAILGUN_API_KEY=

MAILGUN_DOMAIN=

PREFIX=

CLIENT_URL=http://localhost:5173
```

   - **`DATABASE_URL`** The hostname for your PostgreSQL database server (you can use the one from the example file)
   - **`SESSION_SECRET`** Can be any string that can be used to encrypt & decrypt your cookie for sessions.
   - **`CLOUDINARY_CLOUD_NAME`** Cloudinary API Credentials
   - **`CLOUDINARY_API_KEY`** Cloudinary API Credentials
   - **`CLOUDINARY_API_SECRET`** Cloudinary API Credentials
   - **`MAILGUN_API_KEY`** Mailgun API Credentials
   - **`MAILGUN_DOMAIN`** Mailgun API Credentials
   - **`PREFIX`** Can be any string that can be used to encrypt & decrypt your redis data

9. Run `npm run start:dev` to start the project in development mode.

## Setting up the Frontend

1. Change directory to frontend
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the project in development mode.

## MVP

As a user, I can

- sign up / sign in / sign out / reset pwd / confirm email
- search for friends / add them / delete them
- create conversations with other users / create group conversations
- send messages to other user(s)
- call other users
- see incoming messages live
- see notifications / friends requests / calls live
- see online users live
- see typing indicator
- maintain privacy (can't read others chats/msgs)

## Stack

### BE

- Node + Nest + TS
- WS + WebRTC
- express-session + Redis
- PostgreSQL + Prisma

### FE

- React 18.2+
- Redux Toolkit
- HeadlessUI / TailwindCSS

### DevOps

- Docker + docker-compose

## Current list of TODO's

- [ ] Switch from `axios` to `ReactQuery`
- [ ] Update dependencies
- [ ] Switch to yarn
- [ ] Add commitizen
- [ ] Cover app with tests (`Playwright`, `Jest`, etc.)
- [ ] Add `husky` to run linters and tests before commit
- [ ] Frontend portion need performance improvement, add `useCallback`, `memo`, `useMemo` etc.
- [ ] Implement custom servers
- [ ] Implement file upload (avatars, attachments)
- [ ] Check app for vulnerabilities (OWASP Top 10)
