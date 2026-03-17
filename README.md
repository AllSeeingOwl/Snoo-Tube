# Snooker Tubey Tracker

A web-based tracker for the "Snooker Tubey" game. This app allows you to keep track of London Underground, Overground, and Elizabeth line stations as you play, enforcing game rules like station locking based on the selected difficulty tier, and provides the Overground Wildcard functionality.

## Features

- **Search & Filter:** Instantly search for stations by name, line, or colour.
- **Difficulty Tiers:** Seamlessly switch between Advanced (1 use), Intermediate (2 uses), and Casual (Unlimited uses) rules.
- **Overground Wildcard:** Easily unlock previously used stations using the built-in wildcard button.
- **Offline Support:** Built as a Progressive Web App (PWA). You can install it on your mobile device and use it without an internet connection.
- **Data Persistence:** Your current game state is automatically saved to your device's local storage so you won't lose your progress if you refresh the page.

## Project Structure

- `data/` - Contains the master `Snooker Tubey Database.csv` file.
- `docs/` - Contains game rules and the PDF map.
- `public/` - The core application files (HTML, CSS, JS).
  - `index.html` - The main entry point.
  - `css/styles.css` - Styling.
  - `js/app.js` - Application logic.
  - `manifest.json` & `sw.js` - Service worker setup for offline PWA installation.

## Running Locally

Because the app needs to load the `.csv` file and register a Service Worker, you cannot just double-click the `index.html` file in your browser (due to CORS and security restrictions). You must run it through a local web server.

If you have Python installed, you can easily start a server:

1. Open your terminal/command prompt.
2. Navigate to the root folder of this project.
3. Run the following command:
   ```bash
   python -m http.server 8000
   ```
   (Or `python3 -m http.server 8000` depending on your setup).
4. Open your web browser and go to `http://localhost:8000/public/`.

## Installing on Mobile for Offline Use

You can add this app to your mobile device's home screen. Once added, it will behave like a native app and will work perfectly even when you have no internet connection.

### For iOS (Safari):
1. Host the app online (e.g., using GitHub Pages, Netlify, or Vercel).
2. Open Safari on your iPhone/iPad and navigate to the app's URL.
3. Tap the **Share** button (the square with an arrow pointing up) at the bottom of the screen.
4. Scroll down the share sheet and tap **Add to Home Screen**.
5. Confirm the name and tap **Add**. The app icon will now appear on your home screen.

### For Android (Chrome):
1. Host the app online.
2. Open Chrome on your Android device and navigate to the app's URL.
3. You may see a prompt at the bottom of the screen asking to "Add Snooker Tubey to Home screen". If so, tap it.
4. If the prompt doesn't appear, tap the three-dot menu icon in the top right corner.
5. Tap **Install app** or **Add to Home screen**.
6. Follow the on-screen instructions.

### Note on Updates
If you update the game files (e.g., adding new stations to the CSV), the Service Worker caches the old version. To ensure users get the new version, you may need to update the `CACHE_NAME` in `public/sw.js` or ask users to clear their browser cache.