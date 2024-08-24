# Homepage

<img width="750" alt="image" src="https://github.com/user-attachments/assets/b1107f9b-e81b-439c-a92a-e72c70f04875">

> A highly customizable new tab page featuring a Spotify display, countdowns, and a settings system with a simple syncing system.

## Features

- Spotify now playing display
- Clock with weather info
- Intuitive countdown system
- Customization via settings panel
- Settings sync using sync codes

## Future Plans

- Basic offline mode and PWA for mobile
- Notes section with Markdown support

### Stretch Goals

- Small games like Minesweeper or Sudoku
- School assignment tracker and grade chart

## Run

1. Clone the repository.
2. Install dependencies using `npm` or `yarn`.
3. Start the dev environment with `yarn run dev` or `npm run dev`.
4. Edit the `.env` file:

> ```py
>  WEATHER_KEY = "" # from OpenWeatherMap
>  SPOTIFY_CLIENT_ID = "" # https://developer.spotify.com
>  BACKEND_URL = "" # https://github.com/underscorelior/homepage-backend (deploy on Vercel)
> ```

> [!IMPORTANT]
> Make sure to add `http://localhost:5137` to the redirect URIs
