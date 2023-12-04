# Convex Build Bounty | Jotion

![Copy of Copy of Copy of Fullstack Twitter Clone (6)](https://github.com/AntonioErdeljac/notion-clone-tutorial/assets/23248726/66bcfca3-93bf-4aa4-950d-f98c020e1156)

Check out Antonio's YouTube video that this project is based on. Be sure to subscribe if you are a developer.[VIDEO TUTORIAL](https://www.youtube.com/watch?v=ZbX4Ok9YX94)

## Build Bounty

This project is part of Convex.dev's first "Build Bounty" A combination of a hackathon, a bug bounty and a contest. Convex is a backend development platform with some pretty impressive features. Check them out; they have a generous free tier and an active dev community on discord. -> [Convex Website](https://www.convex.dev/)

You might also want to check out BlockNote, the block-based text editors that gives the "Notion" effect -> [BlockNote](https://www.blocknotejs.org/)

## Notice

I might change the location of this repo in the future but I will definitely build out more features that take advantage of Convex's backend (starting with chat with your documents leveraging vector search and embeddings and switching from EdgeStore to Convex file storage). I will also add instructions to allow anyone who followed Antonio's tutorial to follow this repo as well. So be sure to favorite, star or watch if you're interested.

## 🌟 Features

### Collaborative Project Management

- **Effortless Collaboration**: Add or remove users from shared projects with ease.
- **Creator's Control**: Document creators maintain exclusive rights and deletion authority.

### 🧠 AI-Enhanced Editing

- **Slash Command AI Tools**: Utilize AI features like Action Plan Maker, AI Translation, and Story Generation directly in the BlockNote editor.

### 👥 Real-Time Presence Display

- **Live Collaborative Environment**: Google Docs-like presence indicators showing who's active in real-time.

### Enhanced Document Discovery with Convex Full Text Search

- **Efficient and Reactive Search**: The reactivity of Convex's database is one of it's coolest features. Check out the power of full text search to pinpoint documents containing specific keywords by delving straight into string fields.

### 🎨 Gorgeous User Interface

- **Intuitive and Aesthetic Design**: Elegant UI for an enjoyable collaborative experience.

### 📢 Responsive Notification System

- **Proactive Collaboration Alerts**: Receive real-time updates on every collaborative action in shared documents.

## 🚀 Future Improvements

### Enhanced Collaboration Tools

- **Integrated Communication**: Adding chat and commenting for dynamic collaboration.
- **Document Management**: Implementing a version control system for document history.

### AI Block Enhancements

- **Reusable AI Blocks**: Creating versatile AI components for streamlined development.

### Expanding Collaborative Tools

- **Diverse Collaboration Mediums**: Introducing whiteboards, mindmaps, and canvases.
- **Advanced Real-Time Features**: Vector Search in Chat and instant editor updates.
- **Document Sharing**: AutoShare feature for nested documents.
- **Email Feature and Payment Integration**: Upcoming functionalities for comprehensive service management.

## 🛠 Known Issues

- **Query Trigger Behavior**: Unexpected trigger of functions like `getById` due to current provider setup.
- **Limited Collaboration Notification**: Notifications currently limited to typing activities.
- **Unpredictable Online Status Behavior**: Inconsistencies in online status indications.
- **Collaboration Notification Scope**: Does not currently capture styling changes.

## 💬 Stay Connected

Like, star, and fork this repo to keep up with the latest developments and future features!

### Prerequisites

**Node version 18.x.x**

### Cloning the repository

```shell
git clone https://github.com/AntonioErdeljac/notion-clone-tutorial.git
```

### Install packages

```shell
npm i
```

### Setup .env file

```js
# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

EDGE_STORE_ACCESS_KEY=
EDGE_STORE_SECRET_KEY=

OPENAI_API_KEY
```

### Setup Convex

```shell
npx convex dev

```

### Start the app

```shell
npm run dev
```
