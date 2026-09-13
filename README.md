# Ritumati V11 — Pink NGO Website

This version follows the approved pink reference layout.

## Simple architecture

- GitHub = website code + all public photos
- Google Sheets = impact numbers and district numbers
- GitHub Pages = hosting
- No SQL, Supabase, Firebase or database server

## Google Sheets

Dashboard columns:
`women_reached | sessions | districts_reached | satisfaction | annual_goal | annual_completed`

Districts columns:
`name | city_alias | priority | description | active | pads_distributed | people_helped`

Publish the spreadsheet to web as CSV, then put the Spreadsheet ID in `config.js`.

## Photos

All current visual assets are local in GitHub:
- `assets/hero.jpg`
- `assets/mission.jpg`
- `assets/photos/districts/`
- `assets/photos/testimonials/`
- `assets/photos/gallery/`

Replace these placeholder/reference images with approved Ritumati photos when available.

## GitHub Pages

Settings → Pages → Deploy from a branch → `main` → `/(root)` → Save.

Expected URL:
`https://abhishek05102001.github.io/Ritumati/`


## District naming
Bokaro is displayed only as **Bokaro**. Jamshedpur is used only as the city alias for **East Singhbhum**.


## V9 fixes
- Bokaro never displays a Jamshedpur alias, even if the sheet contains one.
- Mission image uses the full artwork without cropping the handwritten “Informed Today. Healthier Tomorrows.” text.
- Responsive layout retained for desktop, tablet and mobile.


## V10 fixes
- Mission artwork is now a real `<img>` element, so the complete “Informed Today. Healthier Tomorrows.” artwork is shown without horizontal cropping.
- Desktop uses the image's natural aspect ratio; mobile stacks it cleanly.

## Join form → same Google Sheet

The public “Start a conversation” button opens a small form. Responses are stored in a `Join Responses` tab in the **same Google Sheet**.

One-time setup:
1. Open the Ritumati Google Sheet.
2. Extensions → Apps Script.
3. Replace the default code with the contents of `google-apps-script.gs`.
4. Save.
5. Run `setup` once and authorize it.
6. Deploy → New deployment → Web app.
7. Execute as: **Me**.
8. Who has access: **Anyone**.
9. Deploy and copy the Web app URL.
10. Put that URL into `config.js` as `joinFormUrl`.
11. Keep your Sheet ID in `spreadsheetId`.

The form stores: submitted time, name, email, phone, interest and message.

Security/privacy: because responses contain contact details, the `Join Responses` tab should NOT be published to the web. Only the public Dashboard/Districts data should be published.
