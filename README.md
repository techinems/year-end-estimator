# Year-End Estimator

Simple static site that estimates a year-end total based on a current counted number and the hours elapsed in the calendar year.

Files:
- `index.html` — main page using PicoCSS for styling.
- `script.js` — client-side logic for calculations.

Styling:
- `styles.css` — adds a modern card layout and system-aware light/dark color scheme. The site will follow the user's OS preference via `prefers-color-scheme`.

Theme selector:
- The UI includes a Theme selector (System / Light / Dark). The choice is persisted to localStorage so your preference is remembered.

CDN note:
- PicoCSS is loaded from jsDelivr (`https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css`).

How it works:
1. Enter the current counted number.
2. Optionally set the "As of" date/time. If left blank, the current time is used.
3. Click "Estimate Year-end". The script computes:
   - elapsed_hours = hours from start of the calendar year to the provided time
   - rate = counted / elapsed_hours
   - estimate = rate * total_hours_in_year (handles leap years)

Try it locally: open `index.html` in a browser.

Notes:
- All processing is client-side; no server is required.
- Edge cases: the script warns if counted is negative or elapsed hours is zero.
