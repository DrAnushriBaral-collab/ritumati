# Ritumati Website — V12 | Simple Google Sheets + GitHub

This version keeps the setup intentionally simple:

- **Google Sheets** = impact numbers only.
- **GitHub** = all website code and photos.
- **GitHub Pages** = public website hosting.
- No SQL, Supabase, Firebase, database server or secret keys.

## One-time Google Sheets setup

1. Upload `Ritumati_Google_Sheet_Template.xlsx` to Google Drive.
2. Open it with Google Sheets.
3. Keep the `Dashboard` tab and its first row exactly as supplied:
   `women_reached | sessions | districts_reached | satisfaction | annual_goal | annual_completed`
4. Put your real numbers in row 2.
5. In the `Districts` tab, each of all 24 districts has two editable figures: `pads_distributed` and `people_helped`. These are shown on every district card and in the selected district snapshot.
6. In Google Sheets choose **File → Share → Publish to web**.
7. Choose the whole spreadsheet and publish it.
8. Copy the Google Sheet ID from its address. It is the long value between `/d/` and `/edit`.
9. Open `config.js` in this repository and replace `YOUR_GOOGLE_SHEET_ID` with that ID.
10. Commit the change to GitHub.

The website reads the public `Dashboard` and `Districts` tabs using Google's published CSV endpoint. Visitors do not need Google login.

## Updating numbers

Edit row 2 of the `Dashboard` tab. For example:

`1200` → `1500`

The public website will use the new number when it loads/refreshed.

## Photos

All photos stay in GitHub:

- `assets/photos/gallery/`
- `assets/photos/testimonials/`

Replace the starter SVG files with your JPG/PNG files. If you keep the same filenames, no code change is needed. Otherwise update the matching paths in `app.js`.

## GitHub Pages

In the repository:

**Settings → Pages → Build and deployment → Deploy from a branch → main → /(root) → Save**

The site will be available at:

`https://abhishek05102001.github.io/Ritumati/`

## Important

Do not put private beneficiary information in the Google Sheet because the Dashboard is publicly published. Use appropriate consent for real people's photographs and testimonial quotes.

The IMA-MSN logo supplied by the user is stored locally as `assets/ima-msn-logo.png` with the outer white background removed and is shown in the top-right corner. The Ritumati logo is slightly enlarged for clarity. The six priority districts are shown first; the remaining 18 districts are hidden until “View all 24 districts” is clicked.
