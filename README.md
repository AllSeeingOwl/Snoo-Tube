# How to Play Snooker Tubey & Use the Tracker App

## What is Snooker Tubey?
Snooker Tubey is a twist on traditional snooker, combining cue skill with geographic knowledge of London's iconic transport network. Players must call out a valid Underground, Overground, or Elizabeth Line station that corresponds with the colour of the ball potted, based on the official Tube map.

## How to Play

### 1. Basic Gameplay Integration
* Play proceeds as in standard snooker: pot a red, then a colour, repeat.
* After each coloured ball is potted, the player must immediately call out a London station that matches the colour's assigned line(s) according to the rules below.
* Stations can only be used once per game (unless modified by Tiering or Wildcard rules).
  * A valid station must be on the official TfL map and match the colour rules.
  * Players have **10 seconds** to call a station after potting a colour; failure results in a forfeit of that shot's points and the end of their turn.

### 2. Colour-to-Line Assignments
| Ball Colour | Primary Line(s) | Backup Line(s) |
| :--- | :--- | :--- |
| **Red** | Central | Metropolitan & Weaver |
| **Yellow** | Circle | Lioness |
| **Green** | District | Suffragette |
| **Brown** | Bakerloo | Windrush |
| **Blue** | Piccadilly | Victoria |
| **Pink** | Hammersmith & City | Elizabeth |
| **Black** | Northern | Jubilee |

* **Overground Lines:** Distributed across multiple colours to increase flexibility. Note the specific branches assigned.
* **Interchanges:** Stations serving multiple lines can count for *any* of their associated lines, provided the line matches the colour potted.

### 3. Station Usage Rules
* Once a station is called correctly, it is "locked" and cannot be reused (unless modified by Wildcard rules or Station Reuse Tiering).
* **Valid stations must:**
  * Be currently active on the official TfL map.
  * Fall within Zones 1-6 (optional house rule).
  * Match the colour line(s) associated with the ball potted (see Section 2).
* **Incorrect station call** (e.g., wrong line, already used, not on TfL map, out of time) results in:
  * 4-point penalty **OR**
  * Ball-in-hand for opponent (decide as a house rule before starting).
  * The player's turn ends.

### 4. Advanced Options
* **Station Reuse Tiering:**
  * *Casual:* Stations are reusable.
  * *Intermediate:* Each station may be used twice per game.
  * *Advanced:* Strict one-time use per station per game.
* **Out-of-Stations Rule:**
  * If a player believes no valid, unused stations remain for a required line, they may:
    * Use a station from an assigned Backup Line for that colour, **OR**
    * Call an Interchange station that serves the required line (even if primarily known for other lines).
    * If challenged and incorrect, the standard penalty applies. If correct, play continues.
* **Overground Wildcard Feature (Optional):**
  * Once per game, immediately after potting *any* coloured ball, a player may choose to call out a station on *any* **London Overground** line (regardless of the colour potted).
  * If the Overground station call is valid, they **unlock one previously used station**, making it available to be called again later in the game by either player. The player must declare which station is being unlocked.
  * This wildcard call replaces the standard requirement to name a station matching the potted colour for that shot. Points for the potted ball are still scored.
* **Scoring Modifier (Optional):**
  * +1 bonus point for naming a Zone 1 station.
  * +2 bonus points for naming an interchange station served by 3 or more lines (Underground, Overground, DLR, Elizabeth Line).

## How to Use the Tracker App

The **Snooker Tubey Tracker** is a web-based companion app designed to help you keep track of stations as you play.

### Core Features
- **Search & Filter:** Instantly search for stations by name, line, or colour.
- **Difficulty Tiers:** Seamlessly switch between Advanced (1 use), Intermediate (2 uses), and Casual (Unlimited uses) rules. The app will automatically lock stations based on your tier.
- **Locking Stations:** When a valid station is called, find it in the list and click "Record Use". It will automatically be locked and greyed out based on the tier rules.
- **Overground Wildcard:** Easily unlock previously used stations using the built-in wildcard button.
- **Offline Support:** Built as a Progressive Web App (PWA). You can install it on your mobile device and use it without an internet connection.
- **Data Persistence:** Your current game state is automatically saved to your device's local storage so you won't lose your progress if you refresh the page.

## How to Install the App

### Running Locally on Your Computer
Because the app needs to load the `.csv` file database and register a Service Worker, you must run it through a local web server (you cannot simply double-click the `index.html` file).

If you have Node.js and `pnpm` installed, you can easily start a server:

1. Open your terminal/command prompt.
2. Navigate to the root folder of this project.
3. Install dependencies by running:
   ```bash
   pnpm install
   ```
4. Start the server by running:
   ```bash
   pnpm start
   ```
   *(Or `node server.js`).*
5. Open your web browser and go to `http://localhost:3000/`.

### Installing on Mobile for Offline Use
You can add this app to your mobile device's home screen. Once added, it will behave like a native app and will work perfectly even when you have no internet connection.

#### For iOS (Safari):
1. Host the app online (e.g., using GitHub Pages, Netlify, or Vercel), or navigate to the hosted URL on your iPhone/iPad.
2. Tap the **Share** button (the square with an arrow pointing up) at the bottom of the screen.
3. Scroll down the share sheet and tap **Add to Home Screen**.
4. Confirm the name and tap **Add**. The app icon will now appear on your home screen.

#### For Android (Chrome):
1. Host the app online, or navigate to the hosted URL on your Android device.
2. You may see a prompt at the bottom of the screen asking to "Add Snooker Tubey to Home screen". If so, tap it.
3. If the prompt doesn't appear, tap the three-dot menu icon in the top right corner.
4. Tap **Install app** or **Add to Home screen**.
5. Follow the on-screen instructions.
