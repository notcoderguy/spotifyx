# SpotifyX 🎵✨

Welcome to **SpotifyX** - a dynamic, real-time Spotify dashboard to visualize your musical journey! Seamlessly integrating with Spotify's rich API, this project provides live updates on your current playback, dives into your recently played tracks, and showcases your top tracks with a sleek and intuitive interface. 🚀🎧

## Features

- **Now Playing**: Stay updated with the current track playing on your Spotify account. 🎶
- **Recently Played Tracks**: Take a quick look back at what you've been listening to. 🕒
- **Top Tracks**: Explore your most-loved tracks displayed elegantly. 🏆
- **Live Updates**: The dashboard refreshes dynamically, ensuring you're always in tune with your current playback. ⏳
- **Weekly Refreshes for Top Tracks**: Your top tracks get a fresh update every week, keeping your insights current. 🔄

## Setup and Deployment

SpotifyX is designed to be easily set up and deployed, with Docker containers for both the API and the frontend, ensuring a smooth and straightforward deployment process.

### Prerequisites

- Docker and Docker Compose
- Spotify API Credentials
- A Redis instance

### Getting Started

1. **Clone the Repository**

   ```
   git clone https://github.com/notcoderguy/spotifyx.git && cd spotifyx
   ```

2. **Environment Setup**

   Create a `.env` file in the API root and fill in your Spotify API credentials and Redis host:

   ```
   SPOTIFY_CLIENT_ID=<your_spotify_client_id>
   SPOTIFY_SECRET_ID=<your_spotify_secret_id>
   SPOTIFY_REFRESH_TOKEN=<your_spotify_refresh_token>
   REDIS_HOST=<your_redis_host>
   WAIT_TIME=<your_desired_wait_time>
   ```

   After this create a `.env.prod` file in the website root and fill in the API host:

   ```
   REACT_APP_API_BASE_URL=<your_api_base_url>
   ```

3. **Docker**

   Use Docker Compose to build and run the services:

   ```
   docker-compose up --build
   ```

   This will start the API server alongside the React frontend, both within their respective Docker containers, fully configured and connected to your Redis instance.

## Tech Stack

- **Frontend**: React, TailwindCSS for a responsive and modern UI.
- **Backend**: A FastAPI server interfaces with the Spotify API and handles data caching using Redis for optimized performance.
- **Deployment**: Docker and Docker Compose for easy deployment and scalability.

## Contributing

Contributions are what make the open-source community such a fantastic place to learn, inspire, and create. Any contributions to **SpotifyX** are **greatly appreciated**. 🌟

## Inspiration

This project is highly inspired by [navotrem](https://github.com/novatorem/novatorem) and also contains some code from it in the API server although I used fastAPI instead of using flask.

## License

Distributed under the MIT License. See `LICENSE` for more information.