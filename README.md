# Snooker Tubey

## Overview

A twist on traditional snooker, combining cue skill with geographic knowledge of London's iconic transport network. Players must call out a valid Underground, Overground, or Elizabeth Line station that corresponds with the colour of the ball potted, based on the official Tube map.

## Ruleset

### 1. Basic Gameplay Integration

- Play proceeds as in standard snooker: pot a red, then a colour, repeat.
- After each coloured ball is potted, the player must immediately call out a London station that matches the colour's assigned line(s) according to the rules below.
- Stations can only be used once per game (unless modified by Tiering or Wildcard rules).
  - A valid station must be on the official TfL map and match the colour rules.
  - Players have **10 seconds** to call a station after potting a colour; failure results in a forfeit of that shot's points and the end of their turn.

### 2. Colour-to-Line Assignments

| **Ball Colour** | **Primary Line(s)** | **Backup Line(s)** |
| --- | --- | --- |
| **Red** | Central | Metropolitan & Weaver |
| **Yellow** | Circle | Lioness |
| **Green** | District | Suffragette |
| **Brown** | Bakerloo | Windrush |
| **Blue** | Piccadilly | Victoria |
| **Pink** | Hammersmith & City | Elizabeth |
| **Black** | Northern | Jubilee |

- **Overground Lines:** Distributed across multiple colours to increase flexibility. Note the specific branches assigned.
- **Interchanges:** Stations serving multiple lines can count for _any_ of their associated lines, provided the line matches the colour potted.

### 3. Station Usage Rules

- Once a station is called correctly, it is "locked" and cannot be reused (unless modified by Wildcard rules or Station Reuse Tiering).
- **Valid stations must:**
  - Be currently active on the official TfL map.
  - Fall within Zones 1-6 (optional house rule).
  - Match the colour line(s) associated with the ball potted (see Section 2).
- **Incorrect station call** (e.g., wrong line, already used, not on TfL map, out of time) results in:
  - 4-point penalty **OR**
  - Ball-in-hand for opponent (decide as a house rule before starting).
  - The player's turn ends.

### 4. Advanced Options

- **Station Reuse Tiering:**
  - _Casual:_ Stations are reusable.
  - _Intermediate:_ Each station may be used twice per game.
  - _Advanced:_ Strict one-time use per station per game.
- **Out-of-Stations Rule:**
  - If a player believes no valid, unused stations remain for a required line, they may:
    - Use a station from an assigned Backup Line for that colour, **OR**
    - Call an Interchange station that serves the required line (even if primarily known for other lines).
    - If challenged and incorrect, the standard penalty applies. If correct, play continues.
- **Overground Wildcard Feature (Optional):**
  - Once per game, immediately after potting _any_ coloured ball, a player may choose to call out a station on _any_ **London Overground** line (regardless of the colour potted).
  - If the Overground station call is valid, they **unlock one previously used station**, making it available to be called again later in the game by either player. The player must declare which station is being unlocked.
  - This wildcard call replaces the standard requirement to name a station matching the potted colour for that shot. Points for the potted ball are still scored.
- **Scoring Modifier (Optional):**
  - +1 bonus point for naming a Zone 1 station.
  - +2 bonus points for naming an interchange station served by 3 or more lines (Underground, Overground, DLR, Elizabeth Line).

### 5. Team Play Variant (Optional)

- 2v2 or teams of more players may compete.
- Teammates may consult on station names but _not_ on cue shots.
- Players take turns potting; station calls are collaborative for the team whose turn it is. Used stations are tracked for the whole game, not per team.

### 6. Optional Tools

- Use a printable reference chart for colour-to-line mapping.
- Use a whiteboard or app to track used stations.
- Digital tools (shared spreadsheets, online trackers) can help in remote or pub settings.
- QR codes linking to TfL station lists or the official map can be added to physical game aids.

---

## Google Sheet Tracker

Using a shared Google Sheet is an excellent and highly recommended way to digitally track used stations during your Snooker Tubey game. It's particularly useful for remote play, or if you simply prefer a digital, easily searchable, and collaborative method over a physical whiteboard.

### Google Apps Script
This repository contains a Google Apps Script helper in `scripts/google_sheet_helper.js`. You can use this script to automate locking and unlocking stations in your Google Sheet.

### Benefits

- **Searchable & Filterable:** Quickly check if a station has been used, its valid lines/colours, or its zone.
- **Collaborative:** Multiple players can view or edit the sheet simultaneously (if permissions are set).
- **Flexible:** Adapts to different Station Reuse Tiering rules, especially when used with the companion Apps Script.
- **Persistent:** Game data is saved automatically.
- **Accurate Tracking:** Ensures clear and consistent application of station usage rules.

### Recommended Columns

For the tracker to work seamlessly with the provided Google Apps Script and your game rules, the following column order and setup are crucial:

1. **Column A:** Station Name
2. **Column B:** Lines Served
3. **Column C:** Valid for Colours
4. **Column D:** Zone(s)
5. **Column E:** Times Used (This Game)
6. **Column F:** Currently Locked?
7. **Column G:** Notes
8. **(Optional) Column H:** Official TFL Line Colour

### Setting Up Your Sheet

1. **Create a New Google Sheet.**
2. **Add the Columns** listed above in the specified order.
3. **Populate Station Data**: You can use the `data/Snooker Tubey Database.csv` file in this repository as a source.
4. **Initial State**: Ensure "Times Used" is 0 and "Currently Locked?" is "No".
5. **Data Validation**: Set "Currently Locked?" (Col F) to be a dropdown with "Yes,No".
6. **Add the Script**:
   - Go to Extensions > Apps Script.
   - Copy the content of `scripts/google_sheet_helper.js` into the script editor.
   - Save and reload the sheet. A "Snooker Game Helper" menu should appear.

---

## Offline Version

### Guide: Creating a Printable Station Checklist

This guide will help you create a printable checklist of London Underground, Overground, Elizabeth Line, and DLR stations. This is a great backup in case digital tools are unavailable.

### Step 1: Obtain the Station List

You can use the `data/Snooker Tubey Database.csv` file in this repository, or the `docs/standard-tube-map.pdf`.

### Step 2: Choose Your Tool

- **Simple Text Editor**: Paste station names, one per line.
- **Word Processor**: Format into columns with checkboxes.
- **Spreadsheet**: Sort alphabetically and print.

### Step 3: Format Your Checklist

- **Alphabetical Order**: Recommended for quick look-ups.
- **Columns**: Use 2-4 columns to save paper.
- **Checkboxes**: Include space to mark stations as used.
- **Font Size**: Ensure it is legible (9-11pt).

### Step 4: Print and Use

Mark off stations as they are called. If playing Intermediate tier, mark once for first use, again for second.
