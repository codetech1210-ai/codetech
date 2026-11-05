# Add photos and videos through the code

1. Copy the media file into `assets/gallery/`.
2. Open `gallery-data.js` and add an entry to `window.siteGalleryItems`:

```js
{ name: "Robotics workshop", category: "ATL Lab", src: "assets/gallery/robotics.jpg", type: "image" },
{ name: "Planetarium visit", category: "Astronomy", src: "assets/gallery/planetarium.mp4", type: "video" },
```

Use `ATL Lab`, `Physics`, or `Astronomy` as the category. Use `image` or `video` as the type. Keep a comma between entries. Edit an entry to change its title or category; remove the entry from the list to remove it from the website.

These code-managed items are included with the website files when it is published. The Gallery's **Add photos or videos** button is separate and saves uploads only in that browser on that device.
