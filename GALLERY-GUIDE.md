# Add public gallery photos using GitHub URLs

The website gallery is managed entirely through code. Visitors do not get upload, edit, or delete controls. Everyone sees the same published gallery.

## Step 1 — Upload the media to GitHub

Upload your photo/video files to your GitHub repository, for example in a folder named `photos` or `videos`.

## Step 2 — Copy the Raw URL

On GitHub, open the uploaded image file and click **Raw**. Copy the address from the browser.

A GitHub Raw URL usually looks like:

```text
https://raw.githubusercontent.com/USERNAME/REPOSITORY/main/photos/robotics.jpg
```

Replace `USERNAME`, `REPOSITORY`, branch, and filename with your actual GitHub details. Do not paste the normal GitHub preview page URL (`github.com/.../blob/...`); use the Raw URL.

## Step 3 — Add the URL in `gallery-data.js`

```js
window.siteGalleryItems = [
  {
    name: "Robotics Workshop",
    category: "ATL Lab",
    src: "https://raw.githubusercontent.com/USERNAME/REPOSITORY/main/photos/robotics.jpg",
    type: "image"
  },
  {
    name: "Astronomy Activity",
    category: "Astronomy",
    src: "https://raw.githubusercontent.com/USERNAME/REPOSITORY/main/photos/astronomy.jpg",
    type: "image"
  }
];
```

Add a comma between entries. Categories must be `ATL Lab`, `Physics`, or `Astronomy`. Use `type: "image"` for photos and `type: "video"` for supported video files.

## Step 4 — Publish

Commit and push `gallery-data.js` to the GitHub Pages publishing branch/folder. GitHub Pages rebuilds the site. All visitors will then see the updated gallery.

## Educator portraits

Educator portraits can also use GitHub Raw URLs. In `app.js`, set the relevant educator object's `photo` property to the Raw URL:

```js
photo: "https://raw.githubusercontent.com/USERNAME/REPOSITORY/main/photos/teacher.jpg"
```

Then commit and push the change.

## Notes

- The GitHub repository and files must be publicly accessible for public visitors.
- Check each Raw URL in a private/incognito browser window before publishing.
- Keep filenames simple and avoid spaces where possible.
- Only publish photos/videos for which the school has permission.
