# Deployment notes

This is a static HTML/CSS/JavaScript website. It can be hosted on GitHub Pages or Netlify.

## GitHub Pages

Use the repository's **Settings → Pages** settings to choose the branch and folder to publish. Keep `index.html`, `styles.css`, `stars.css`, `gallery-data.js`, `app.js`, and the `assets/` folder together in the published root. Relative asset paths are used for compatibility with GitHub Pages project sites.

## Netlify

The included `netlify.toml` publishes the project root (`.`). If deploying manually, upload this project folder, not a parent folder containing private material.

## Manage public media

The website has no public upload controls. Add public gallery files to `assets/gallery/` and update `gallery-data.js`. Add educator portraits to `assets/educators/` and set their paths in the `quotes` array in `app.js`. See `GALLERY-GUIDE.md`.

## Before publishing

- Replace sample educator names, titles, and quotations with approved school content.
- Verify contact details and social links.
- Ensure you have permission to publish all student and staff photographs/videos.
